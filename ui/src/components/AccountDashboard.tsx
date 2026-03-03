import React, { useEffect, useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";


const PLACEHOLDER = "Placeholder";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

function convertToNumber(value: string): number {
  return Number(value);
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [account, setAccount] = useState(props.account);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>(""); 
  const [withdrawError, setWithdrawError] = useState<string>("");
  const [depositError, setDepositError] = useState<string>("");

  const {signOut} = props;

  useEffect(() => {
    if(depositAmount !== "") {
      const depositNumber = convertToNumber(depositAmount);
      if(Number.isNaN(depositNumber) || depositNumber <= 0) {
        setDepositError("Please enter a value between 1 and 1000.");
      } else if(depositNumber > 1000) {
        setDepositError("Deposit cannot exceed $1000.");
      } else if(account.type === 'credit' && depositNumber > Math.abs(account.amount)) {
        setDepositError("Deposit cannot exceed credit account balance.");
      } else {
        setDepositError("");
      }
    } else {
      setDepositError("");
    }
  }, [depositAmount]);

  useEffect(() => {
    if(withdrawAmount !== "") {
      const withdrawNumber = convertToNumber(withdrawAmount);
      if(Number.isNaN(withdrawNumber) || withdrawNumber <= 0) {
        setWithdrawError("Please enter a value between 1 and 200.");
      } else if(withdrawNumber > 200) {
        setWithdrawError("Withdrawl cannot exceed $200.");
      } else if(withdrawNumber > account.remainingWithdrawlLimit) {
        setWithdrawError("Withdrawls cannot exceed $400 daily.");
      } else if(withdrawNumber % 5 !== 0) {
        setWithdrawError("Withdrawl must be a multiple of 5.");
      } else if(account.type !== 'credit' && withdrawNumber > account.amount) {
        setWithdrawError("Withdrawl cannot exceed account balance.");
      } else if(account.type === 'credit' && account.creditLimit - (Math.abs(account.amount) + withdrawNumber) < 0) {
        setWithdrawError("Withdrawl cannot exceed credit limit.");
      } else {
        setWithdrawError("");
      }
    } else {
      setWithdrawError("");
    }
  }, [withdrawAmount]);

  const depositFunds = async () => {
    if(!depositError) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({amount: convertToNumber(depositAmount) })
      }
      const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
      const data = await response.json();
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit,
        remainingWithdrawlLimit: data.remaining_withdrawl_limit
      });
      setDepositAmount("");
    }
  }

  const withdrawFunds = async () => {
    if(!withdrawError) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({amount: convertToNumber(withdrawAmount)})
      }
      const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
      const data = await response.json();
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit,
        remainingWithdrawlLimit: data.remaining_withdrawl_limit
      });
      setWithdrawAmount("");
    }
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField 
                label="Deposit Amount" 
                variant="outlined" 
                type="string"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                value={depositAmount}
                error={!!depositError}
                onChange={(e) =>  {
                  setDepositAmount(e.target.value)
                }}
              />
              <p style={{ visibility: depositError ? 'visible' : 'hidden', color: 'red', margin: 0 }}>{depositError || PLACEHOLDER}</p>
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2,
                  opacity: !depositAmount || depositError ? "0.5" : "1",
                  pointerEvents: !depositAmount || depositError ? "none" : "auto",
                }}
                onClick={depositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField 
                label="Withdraw Amount" 
                variant="outlined" 
                type="string" 
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                error={!!withdrawError}
                value={withdrawAmount}
                onChange={(e) =>  {
                  setWithdrawAmount(e.target.value)
                }}
              />
              <p style={{ visibility: withdrawError ? 'visible' : 'hidden', color: 'red', margin: 0 }}>{withdrawError || PLACEHOLDER}</p>
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2,
                  opacity: !withdrawAmount || withdrawError ? "0.5" : "1",
                  pointerEvents: !withdrawAmount || withdrawError ? "none" : "auto",
                }}
                onClick={withdrawFunds}
                >
                  Submit
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
    
  )
}