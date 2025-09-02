## ECDSA Wallet WebApp

A full-stack wallet simulator demonstrating digital signatures with **Elliptic Curve Digital Signature Algorithm (ECDSA)** over `secp256k1` (same curve as Ethereum). The app derives addresses from private keys, signs transfer intents client-side, and verifies signatures on the server before moving balances.

## Features

- Derive wallet address from a private key
- View on-chain-like balance for a given address
- Sign transfers client-side using `secp256k1`
- Server verifies signatures (public key recovery) before applying transfers
- Input validation (addresses, amounts)
- Implemented `/verify` endpoint to check signatures without moving funds

## Technology

| Layer        | Tech Stack                                   |
|--------------|----------------------------------------------|
| Frontend     | React, Vite, Axios, SCSS                     |
| Backend      | Node.js, Express                             |
| Crypto       | ethereum-cryptography (secp256k1, keccak256) |
| API          | REST                                         |


## Run locally

Open two terminals.

- Server
  ```bash
  cd server
  npm install
  npx nodemon index   # or: node index
  ```

- Client
  ```bash
  cd client
  npm install
  npm run dev
  ```

Visit `http://localhost:5173`.

## Generate keys

Use the helper script to create a private key, public key, and derived address:

```bash
node server/scripts/generate.js
```

Paste the PRIVATE KEY into the app. The address will appear and its balance will be fetched. Use another known address as the recipient.


