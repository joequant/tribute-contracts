// Whole-script strict mode syntax
"use strict";

/**
MIT License

Copyright (c) 2020 Openlaw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

const { entryDao, entryBank } = require("./access-control-util");
const { adaptersIdsMap } = require("./dao-ids-util");
const { UNITS, LOOT, sha3, toBN, embedConfigs } = require("./contract-util.js");
const { ContractType } = require("../deployment/contracts.config");
const sleep = (t) => new Promise((s) => setTimeout(s, t));

const createFactories = async ({
  BankExtension,
  BankFactory,
  ERC1271Extension,
  ERC1271ExtensionFactory,
  NFTExtension,
  NFTCollectionFactory,
  ERC20Extension,
  ERC20TokenExtensionFactory,
  ExecutorExtension,
  ExecutorExtensionFactory,
  InternalTokenVestingExtensionFactory,
  InternalTokenVestingExtension,
  ERC1155TokenExtension,
  ERC1155TokenCollectionFactory,
  deployFunction,
}) => {
  const bankExtFactory = await deployFunction(BankFactory, [BankExtension]);

  const erc1271ExtFactory = await deployFunction(ERC1271ExtensionFactory, [
    ERC1271Extension,
  ]);

  const erc721ExtFactory = await deployFunction(NFTCollectionFactory, [
    NFTExtension,
  ]);

  const erc20ExtFactory = await deployFunction(ERC20TokenExtensionFactory, [
    ERC20Extension,
  ]);

  const executorExtFactory = await deployFunction(ExecutorExtensionFactory, [
    ExecutorExtension,
  ]);

  const erc1155ExtFactory = await deployFunction(
    ERC1155TokenCollectionFactory,
    [ERC1155TokenExtension]
  );

  const vestingExtFactory = await deployFunction(
    InternalTokenVestingExtensionFactory,
    [InternalTokenVestingExtension]
  );
  return {
    bankExtFactory,
    erc20ExtFactory,
    erc721ExtFactory,
    erc1271ExtFactory,
    executorExtFactory,
    erc1155ExtFactory,
    vestingExtFactory,
  };
};

const createExtensions = async ({ dao, factories, options }) => {
  const extensions = {};
  await Object.values(factories).reduce((p, factory) => {
    return p
      .then((_) =>
        createExtension({
          dao,
          factory,
          options,
        })
      )
      .then((extension) => (extensions[extension.configs.alias] = extension))
      .catch((e) => console.error(e));
  }, Promise.resolve());
  return extensions;
};

const createAdapters = async ({ dao, daoFactory, extensions, options }) => {
  const adapters = {};
  await Object.values(options.contractConfigs)
    .filter((config) => config.type === ContractType.Adapter)
    .filter((config) => config.enabled)
    .filter((config) => !config.skipAutoDeploy)
    .reduce((p, config) => {
      return p
        .then((_) => {
          const contract = options[config.name];
          if (!contract) throw new Error(`Missing contract ${config.name}`);
          return options.deployFunction(contract).catch((e) => {
            console.error(`Failed deployment [${config.name}].`, e);
            throw e;
          });
        })
        .then((adapter) => (adapters[adapter.configs.alias] = adapter));
    }, Promise.resolve());

  const missingConfigs = Object.keys(adapters).find(
    (a) => !adapters[a].configs
  );

  if (missingConfigs)
    throw new Error(
      `Missing adapter configs for [${missingConfigs}] adapter(s)`
    );

  return adapters;
};

const deployDao = async (options) => {
  const { dao, daoFactory } = await cloneDao({
    ...options,
    name: options.daoName || "test-dao",
  });

  const factories = await createFactories(options);
  const extensions = await createExtensions({ dao, factories, options });
  const adapters = await createAdapters({
    dao,
    daoFactory,
    extensions,
    options,
  });

  await configureDao({
    owner: options.owner,
    dao,
    daoFactory,
    extensions,
    adapters,
    options,
  });

  const votingHelpers = await configureOffchainVoting({
    ...options,
    dao,
    daoFactory,
    extensions,
  });

  // If the offchain contract was created, set it to the adapters map using the alias
  if (votingHelpers.offchainVoting) {
    adapters[votingHelpers.offchainVoting.configs.alias] =
      votingHelpers.offchainVoting;
  }

  // deploy test token contracts for testing convenience
  const testContracts = await createTestContracts({ ...options });

  if (options.finalize) {
    await dao.finalizeDao({ from: options.owner });
  }

  return {
    dao: dao,
    adapters: adapters,
    extensions: extensions,
    testContracts: testContracts,
    votingHelpers: votingHelpers,
    factories: { ...factories, daoFactory },
  };
};

const cloneDao = async ({
  owner,
  creator,
  deployFunction,
  DaoRegistry,
  DaoFactory,
  name,
}) => {
  let daoFactory = await deployFunction(DaoFactory, [DaoRegistry], owner);

  await daoFactory.createDao(name, creator ? creator : owner, { from: owner });

  let _address = await daoFactory.getDaoAddress(name);
  let newDao = await DaoRegistry.at(_address);
  return { dao: newDao, daoFactory, daoName: name };
};

const configureDao = async ({
  owner,
  dao,
  daoFactory,
  extensions,
  adapters,
  options,
}) => {
  const configureAdaptersWithDAOAccess = async () => {
    const adaptersWithAccess = Object.values(adapters)
      .filter((a) => a.configs.enabled)
      .filter((a) => !a.configs.skipAutoDeploy)
      .filter((a) => a.configs.acls.dao)
      .reduce((withAccess, a) => {
        const configs = a.configs;
        withAccess.push(entryDao(configs.id, a.address, configs.acls));
        return withAccess;
      }, []);

    // If an extension needs access to other extension,
    // the extension needs to be added as an adapter to the DAO,
    // but without any ACL flag enabled.
    const contractsWithAccess = Object.values(extensions)
      .filter((e) => e.configs.enabled)
      .filter((a) => !a.configs.skipAutoDeploy)
      .filter((e) => Object.keys(e.configs.acls.extensions).length > 0)
      .reduce((withAccess, e) => {
        const configs = e.configs;
        const v = entryDao(configs.id, e.address, configs.acls);
        withAccess.push(v);
        return withAccess;
      }, adaptersWithAccess);

    await daoFactory.addAdapters(dao.address, contractsWithAccess, {
      from: owner,
    });
  };

  const configureAdaptersWithDAOParameters = async () => {
    if (adapters.onboarding) {
      await adapters.onboarding.configureDao(
        dao.address,
        UNITS,
        options.unitPrice,
        options.nbUnits,
        options.maxChunks,
        options.tokenAddr,
        {
          from: owner,
        }
      );

      await adapters.onboarding.configureDao(
        dao.address,
        LOOT,
        options.unitPrice,
        options.nbUnits,
        options.maxChunks,
        options.tokenAddr,
        {
          from: owner,
        }
      );
    }
    if (adapters.couponOnboarding)
      await adapters.couponOnboarding.configureDao(
        dao.address,
        options.couponCreatorAddress,
        extensions.erc20Ext.address,
        UNITS,
        options.maxAmount,
        options.chainId,
        {
          from: owner,
        }
      );

    if (adapters.voting)
      await adapters.voting.configureDao(
        dao.address,
        options.votingPeriod,
        options.gracePeriod,
        {
          from: owner,
        }
      );

    if (adapters.tribute) {
      await adapters.tribute.configureDao(dao.address, UNITS, {
        from: owner,
      });
      await adapters.tribute.configureDao(dao.address, LOOT, {
        from: owner,
      });
    }

    if (adapters.tributeNFT) {
      await adapters.tributeNFT.configureDao(dao.address, {
        from: owner,
      });
    }
  };

  const configureExtensionAccess = async (contracts, extension) => {
    const withAccess = Object.values(contracts).reduce((accessRequired, c) => {
      const configs = c.configs;
      accessRequired.push(
        extension.configs.buildAclFlag(c.address, configs.acls)
      );
      return accessRequired;
    }, []);

    if (withAccess.length > 0)
      await daoFactory.configureExtension(
        dao.address,
        extension.address,
        withAccess,
        { from: owner }
      );
  };

  /**
   * Configures all the adapters that need access to the DAO and each enabled extension
   */
  const configureAdapters = async () => {
    await configureAdaptersWithDAOAccess();
    await configureAdaptersWithDAOParameters();
    await Object.values(extensions)
      .filter((targetExtension) => targetExtension.configs.enabled)
      .filter((targetExtension) => !targetExtension.configs.skipAutoDeploy)
      .reduce((p, targetExtension) => {
        // Filters the enabled adapters that have access to the targetExtension
        const contracts = Object.values(adapters)
          .filter((a) => a.configs.enabled)
          .filter((a) => !a.configs.skipAutoDeploy)
          .filter((a) =>
            // The adapters must have at least 1 ACL flag defined to access the targetExtension
            Object.keys(a.configs.acls.extensions).some(
              (extId) => extId === targetExtension.configs.id
            )
          );

        return p
          .then(() => configureExtensionAccess(contracts, targetExtension))
          .catch((e) => {
            console.error(
              `Error while configuring extension access ${extensions.configs.name}`,
              e
            );
            throw e;
          });
      }, Promise.resolve());
  };

  /**
   * Configures all the extensions that need access to
   * other enabled extensions
   */
  const configureExtensions = async () => {
    await Object.values(extensions)
      .filter((targetExtension) => targetExtension.configs.enabled)
      .reduce((p, targetExtension) => {
        // Filters the enabled extensions that have access to the targetExtension
        const contracts = Object.values(extensions)
          .filter((e) => e.configs.enabled)
          .filter((e) => e.configs.id !== targetExtension.configs.id)
          .filter((e) =>
            // The other extensions must have at least 1 ACL flag defined to access the targetExtension
            Object.keys(e.configs.acls.extensions).some(
              (extId) => extId === targetExtension.configs.id
            )
          );

        return p.then(() =>
          configureExtensionAccess(contracts, targetExtension)
        );
      }, Promise.resolve());
  };

  await configureAdapters();
  await configureExtensions();
};

const createExtension = async ({ dao, factory, options }) => {
  const factoryConfigs = factory.configs;
  const extensionConfigs = options.contractConfigs.find(
    (c) => c.id === factoryConfigs.generatesExtensionId
  );
  if (!extensionConfigs)
    throw new Error(
      `Missing extension configuration <generatesExtensionId> for in ${factoryConfigs.name} configs`
    );

  if (
    factoryConfigs.deploymentArgs &&
    factoryConfigs.deploymentArgs.length > 0
  ) {
    const args = factoryConfigs.deploymentArgs.map((argName) => {
      const arg = options[argName];
      if (arg !== null && arg !== undefined) return arg;
      throw new Error(
        `Missing deployment argument <${argName}> in ${factoryConfigs.name}.create`
      );
    });
    await factory.create(...args);
  } else {
    await factory.create();
  }

  let pastEvent;

  while (pastEvent === undefined) {
    await sleep(100);
    let pastEvents = await factory.getPastEvents();
    pastEvent = pastEvents[0];
  }

  const { extensionAddress } = pastEvent.returnValues;
  const extensionContract = options[extensionConfigs.name];
  if (!extensionContract)
    throw new Error(
      `Extension contract not found for ${extensionConfigs.name}`
    );

  const newExtension = embedConfigs(
    await extensionContract.at(extensionAddress),
    extensionContract.contractName,
    options.contractConfigs
  );

  if (!newExtension || !newExtension.configs)
    throw new Error(
      `Unable to embed extension configs for ${extensionConfigs.name}`
    );

  await dao.addExtension(
    sha3(newExtension.configs.id),
    newExtension.address,
    options.owner,
    {
      from: options.owner,
    }
  );

  return newExtension;
};

const createTestContracts = async ({
  deployTestTokens,
  deployFunction,
  TestToken1,
  TestToken2,
  Multicall,
  PixelNFT,
  OLToken,
  ProxToken,
  ERC1155TestToken,
}) => {
  const testContracts = {
    oltToken: null,
    testToken1: null,
    testToken2: null,
    multicall: null,
    pixelNFT: null,
    proxToken: null,
    erc1155TestToken: null,
  };

  if (deployTestTokens) {
    testContracts.testToken1 = await deployFunction(TestToken1, [1000000]);
    testContracts.testToken2 = await deployFunction(TestToken2, [1000000]);
    testContracts.multicall = await deployFunction(Multicall);
    testContracts.pixelNFT = await deployFunction(PixelNFT, [100]);
    testContracts.oltToken = await deployFunction(OLToken, [
      toBN("1000000000000000000000000"),
    ]);
    testContracts.proxToken = await deployFunction(ProxToken);
    testContracts.erc1155TestToken = await deployFunction(ERC1155TestToken, [
      "1155 test token",
    ]);
  }
  return testContracts;
};

const configureOffchainVoting = async ({
  dao,
  daoFactory,
  offchainVoting,
  chainId,
  owner,
  offchainAdmin,
  votingPeriod,
  gracePeriod,
  SnapshotProposalContract,
  KickBadReporterAdapter,
  OffchainVotingContract,
  OffchainVotingHashContract,
  deployFunction,
  extensions,
}) => {
  const votingHelpers = {
    snapshotProposalContract: null,
    handleBadReporterAdapter: null,
    offchainVoting: null,
  };

  // Offchain voting is disabled
  if (!offchainVoting) return votingHelpers;

  const currentVotingAdapterAddress = await dao.getAdapterAddress(
    sha3(adaptersIdsMap.VOTING_ADAPTER)
  );

  const snapshotProposalContract = await deployFunction(
    SnapshotProposalContract,
    [chainId]
  );

  const offchainVotingHashContract = await deployFunction(
    OffchainVotingHashContract,
    [snapshotProposalContract.address]
  );

  const handleBadReporterAdapter = await deployFunction(KickBadReporterAdapter);
  const offchainVotingContract = await deployFunction(OffchainVotingContract, [
    currentVotingAdapterAddress,
    offchainVotingHashContract.address,
    snapshotProposalContract.address,
    handleBadReporterAdapter.address,
    offchainAdmin,
  ]);

  await daoFactory.updateAdapter(
    dao.address,
    entryDao(
      offchainVotingContract.configs.id,
      offchainVotingContract.address,
      offchainVotingContract.configs.acls
    ),
    {
      from: owner,
    }
  );

  await dao.setAclToExtensionForAdapter(
    extensions.bankExt.address,
    offchainVotingContract.address,
    entryBank(
      offchainVotingContract.address,
      offchainVotingContract.configs.acls
    ).flags,
    { from: owner }
  );

  await offchainVotingContract.configureDao(
    dao.address,
    votingPeriod,
    gracePeriod,
    10,
    { from: owner }
  );

  votingHelpers.offchainVoting = offchainVotingContract;
  votingHelpers.handleBadReporterAdapter = handleBadReporterAdapter;
  votingHelpers.snapshotProposalContract = snapshotProposalContract;

  return votingHelpers;
};

const networks = [
  {
    name: "ganache",
    chainId: 1337,
  },
  {
    name: "rinkeby",
    chainId: 4,
  },
  {
    name: "rinkeby-fork",
    chainId: 4,
  },
  {
    name: "test",
    chainId: 1,
  },
  {
    name: "coverage",
    chainId: 1,
  },
  {
    name: "mainnet",
    chainId: 1,
  },
];

const getNetworkDetails = (name) => {
  return networks.find((n) => n.name === name);
};

module.exports = {
  deployDao,
  cloneDao,
  createAdapters,
  createFactories,
  createExtensions,
  createExtension,
  getNetworkDetails,
};
