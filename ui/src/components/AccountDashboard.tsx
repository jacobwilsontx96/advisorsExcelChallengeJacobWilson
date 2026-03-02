import React, { useEffect, useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";


const PLACEHOLDER = "Placeholder";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [account, setAccount] = useState(props.account); 
  const [withdrawError, setWithdrawError] = useState<string>("");
  const [depositError, setDepositError] = useState<string>("");
  const [withdrawToched, setWithdrawFormToched] = useState<boolean>(false);
  const [depositFormToched, setDepositFormToched] = useState<boolean>(false);

  const {signOut} = props;

  useEffect(() => {
    if(depositFormToched) {
      if(depositAmount <= 0) {
        setDepositError("Please enter a value greater than zero.");
      } else if(depositAmount > 1000) {
        setDepositError("Deposit cannot exceed $1000.");
      } else if(account.type === 'credit' && depositAmount > Math.abs(account.amount)) {
        setDepositError("Deposit cannot exceed credit account balance.");
      } else {
        setDepositError("");
      }
    }
  }, [depositAmount, depositFormToched]);

  useEffect(() => {
    switch(withdrawAmount) {
      case 0:
        setWithdrawError("Please enter a value greater than zero.");
        break;
      default:
        setWithdrawError("");
        break;
    }
  }, [withdrawAmount]);

  const depositFunds = async () => {
    if(!depositError) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({amount: depositAmount})
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
    }
  }

  const withdrawFunds = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: withdrawAmount})
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
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                error={!!depositError}
                onChange={(e) =>  {
                  if(!depositFormToched) setDepositFormToched(true);
                  setDepositAmount(+e.target.value)
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
                type="number" 
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                error={!!withdrawError}
                onChange={(e) => setWithdrawAmount(+e.target.value)}
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