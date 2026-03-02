import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

const throwError = () => {
  throw new Error("Transaction failed")
}

export const withdrawal = async (accountID: string, amount: number) => {
 
  const withdrawal_table_res = await query(`
    INSERT INTO withdrawls (account_number, withdrawl_amount, withdrawl_date)
    VALUES ($1, $2, CURRENT_DATE)
    RETURNING *`,
    [accountID, amount]
  );

  if (withdrawal_table_res.rowCount === 0) {
    throwError();
  }

  const account = await getAccount(accountID);
  account.amount -= amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throwError();
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  account.amount += amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throwError()
  }

  return account;
}