import { query } from "../utils/db";

export const getAccount = async (accountID: string) => {
  const res = await query(`
    SELECT accounts.account_number, accounts.name, accounts.amount, accounts.type, accounts.credit_limit,
    400 - COALESCE(SUM(withdrawls.withdrawl_amount), 0) AS remaining_withdrawl_limit 
    FROM accounts
    LEFT JOIN withdrawls 
      ON accounts.account_number = withdrawls.account_number
      AND withdrawls.withdrawl_date = CURRENT_DATE 
    WHERE accounts.account_number = $1
    GROUP BY 
      accounts.account_number,
      accounts.name,
      accounts.amount,
      accounts.type,
      accounts.credit_limit;`,
    [accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Account not found");
  }

  return res.rows[0];
};