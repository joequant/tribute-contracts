import { Address, Bytes, log } from "@graphprotocol/graph-ts";

import { OffchainVotingContract } from "../../generated/templates/DaoRegistry/OffchainVotingContract";
import { VotingContract } from "../../generated/templates/DaoRegistry/VotingContract";
import { IVoting } from "../../generated/templates/DaoRegistry/IVoting";

import { Proposal, Vote } from "../../generated/schema";

export function loadProposalAndSaveVoteResults(
  daoAddress: Address,
  proposalId: Bytes
): Proposal | null {
  // load the existing proposal
  let maybeProposalId = daoAddress
    .toHex()
    .concat("-proposal-")
    .concat(proposalId.toHex());
  let proposal = Proposal.load(maybeProposalId);

  if (proposal) {
    let voteId = daoAddress.toHex().concat("-vote-").concat(proposalId.toHex());
    let vote = new Vote(voteId);

    // get the voting adapter address from the proposal
    let votingAdapterAddress: Bytes = proposal.votingAdapter as Bytes;

    if (votingAdapterAddress) {
      let votingIContract = IVoting.bind(
        Address.fromString(votingAdapterAddress.toHex()) as Address
      );
      let votingAdapterName = votingIContract.getAdapterName();

      if (votingAdapterName == "VotingContract") {
        let votingContract = VotingContract.bind(
          Address.fromString(votingAdapterAddress.toHex()) as Address
        );
        // get vote results and voting state
        let voteResults = votingContract.votes(daoAddress, proposalId);
        let voteState = votingContract.voteResult(daoAddress, proposalId);

        // assign voting data
        vote.nbYes = voteResults.value0;
        vote.nbNo = voteResults.value1;

        vote.adapterName = votingAdapterName;
        vote.adapterAddress = votingAdapterAddress;
        vote.proposal = maybeProposalId;

        if (proposal) {
          proposal.nbYes = voteResults.value0;
          proposal.nbNo = voteResults.value1;
          proposal.startingTime = voteResults.value2;
          proposal.blockNumber = voteResults.value3;

          proposal.votingState = voteState.toString();
          proposal.votingResult = voteId;
        }
      } else if (votingAdapterName == "OffchainVotingContract") {
        let offchainVotingContract = OffchainVotingContract.bind(
          Address.fromString(votingAdapterAddress.toHex()) as Address
        );
        // get vote results and state
        let voteResults = offchainVotingContract.votes(daoAddress, proposalId);
        let voteState = offchainVotingContract.voteResult(
          daoAddress,
          proposalId
        );

        // assign voting data
        vote.nbYes = voteResults.value3;
        vote.nbNo = voteResults.value4;

        vote.adapterName = votingAdapterName;
        vote.adapterAddress = votingAdapterAddress;
        vote.proposal = maybeProposalId;

        if (proposal) {
          proposal.snapshot = voteResults.value0;
          proposal.reporter = voteResults.value1;
          proposal.resultRoot = voteResults.value2;

          proposal.nbYes = voteResults.value3;
          proposal.nbNo = voteResults.value4;

          proposal.startingTime = voteResults.value5;
          proposal.gracePeriodStartingTime = voteResults.value6;
          proposal.isChallenged = voteResults.value7;
          proposal.stepRequested = voteResults.value8;
          proposal.forceFailed = voteResults.value9;
          // @todo its a mapping, not generated in schema
          // proposal.fallbackVotes = voteResults.value10;
          proposal.fallbackVotesCount = voteResults.value10;

          proposal.votingState = voteState.toString();
          proposal.votingResult = voteId;
        }
      }
    }

    vote.save();
  }

  return proposal;
}
