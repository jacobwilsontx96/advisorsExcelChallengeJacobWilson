## Questions

### What issues, if any, did you find with the existing code?
I found that the TextFields on AccountDashboard would sometimes set event.target.value to an empty string ("") when the user input was invalid. This led to some issues when validating user input, and is part of the reason that I converted the TextFields to controlled string inputs.

### What issues, if any, did you find with the request to add functionality?
The issue I had was finding a way to manage the daily withdraw limit, but that was doable with a second table.

### Would you modify the structure of this project if you were to start it over? If so, how?
I would modify the table structure to be a single 'transactions' table, and have the account balances calculated similar to how I am calculating the daily withdrawl limit. For example, a deposit transaction could be added to the table and the corresponding account balance could be updated in the SQL itself based of the existing balance and the deposit amount. This way we maintain a single source of truth for account information.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
No, I was able to complete the entire project.

### If you were to continue building this out, what would you like to add next?
I added a 'withdrawls' table to track withdraws so that the user could not exceed the $400 daily limit. This could be modified to be a general 'transactions' table and we could display that data for the user so that they could track recent account activity and balance history.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
Thank you for the opportunity to take this assessment.