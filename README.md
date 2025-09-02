## ECDSA Wallet WebApp

A full-stack cryptographic wallet simulator that demonstrates key aspects of blockchain wallet operations using **Elliptic Curve Digital Signature Algorithm (ECDSA)** over the `secp256k1` curve — the same cryptographic foundation used in Ethereum.
This project allows users to generate and interact with public/private key pairs, check balances, and transfer funds between wallets all in a simple and secure environment.

## Project Overview

This WebApp allows users to:

- Generate ECDSA-based key pairs (public/private)
- Input a private key to derive the wallet address
- View wallet balance
- Transfer funds to other wallets using their address

## 🛠️ Technologies Used

| Layer        | Stack                                      |
|--------------|---------------------------------------------|
| Frontend     | React, Vite, Axios, SCSS                    |
| Backend      | Node.js, Express                            |
| Crypto       | ethereum-cryptography (secp256k1, keccak256)|
| Communication| REST API (Axios-based)                      |


## Setup Instructions
 
### Client

The client folder contains a react app using [vite]. To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://localhost:5173/

### Server

The server folder contains a Node.js server using [express]. To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the dependencies 
3. Run `npm i -g nodemon` and then run `nodemon index` instead of `node index` to automatically restart the server on any changes

The application should connect to the default server port (3042) automatically!

