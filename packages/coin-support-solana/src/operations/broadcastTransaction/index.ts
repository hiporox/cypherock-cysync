import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastSolanaTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransaction = async (
  params: IBroadcastSolanaTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    solanaCoinList,
    transaction.accountId,
  );
  const isMine =
    params.transaction.computedData.output.address === account.xpubOrAddress;

  const txnHash = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin.id,
  );

  const parsedTransaction: ITransaction = {
    hash: txnHash,
    fees: transaction.computedData.fees,
    amount: '0',
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: [{ address: account.xpubOrAddress, amount: '0', isMine: true }],
    outputs: [{ ...params.transaction.userInputs.outputs[0], isMine }],
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    parentAccountId: account.parentAccountId,
  };

  const amount = parsedTransaction.outputs.reduce(
    (sum, output) => (output.isMine ? sum : sum.plus(output.amount)),
    new BigNumber(0),
  );
  parsedTransaction.amount = amount.abs().toString();
  parsedTransaction.inputs[0].amount = amount.abs().toString();

  await insertOrUpdateTransactions(db, [parsedTransaction]);

  return parsedTransaction;
};
