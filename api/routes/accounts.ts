import express, { Request, Response } from "express";
import Joi, { Schema } from "joi";
import { getAccount } from "../handlers/accountHandler";

const DAILY_WITHDRAWL_LIMIT = 400;

const router = express.Router();

const getAccountSchema: Schema = Joi.string().required();

router.get("/:accountID", async (request: Request, response: Response) => {
  const {error} = getAccountSchema.validate(request.params.accountID);
  
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  try {
    const account = await getAccount(request.params.accountID); 
    response.send({
      account_number: account.account_number,
      name: account.name,
      amount: account.amount,
      type: account.type,
      credit_limit: account.credit_limit,
      remaining_withdrawl_limit: DAILY_WITHDRAWL_LIMIT - +account.prev_withdrawl_total
    });
  } catch (err) {
    response.status(404).send({"error": "Account not found"});
  }
});

export default router;

