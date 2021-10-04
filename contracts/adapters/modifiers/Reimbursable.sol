pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "../../core/DaoRegistry.sol";
import "../interfaces/IReimbursement.sol";

/**
MIT License

Copyright (c) 2021 Openlaw

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
abstract contract Reimbursable {
    /**
     * @dev Only registered adapters are allowed to execute the function call.
     */
    modifier reimbursable(DaoRegistry dao) {
        uint256 gasStart = gasleft();
        dao.lockSession();
        IReimbursement reimbursement =
            IReimbursement(dao.getAdapterAddress(DaoHelper.REIMBURSEMENT));
        (bool shouldReimburse, uint256 spendLimitPeriod) =
            reimbursement.shouldReimburse(dao, gasStart);
        require(dao.lockedAt() != block.number, "reentrancy guard");
        _;
        BankExtension bank =
            BankExtension(dao.getExtensionAddress(DaoHelper.BANK));

        uint256 gasUsed = gasleft() - gasStart;
        uint256 payback = gasUsed * tx.gasprice;
        if (shouldReimburse) {
            bank.internalTransfer(
                DaoHelper.GUILD,
                msg.sender,
                DaoHelper.ETH_TOKEN,
                payback
            );

            bank.withdraw(payable(msg.sender), DaoHelper.ETH_TOKEN, payback);
        }
        dao.unlockSession();
    }
}
