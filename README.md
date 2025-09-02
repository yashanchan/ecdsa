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

| Layer        | Tech Stack                                       |
|--------------|----------------------------------------------|
| Frontend     | React, Vite, Axios, SCSS                     |
| Backend      | Node.js, Express                             |
| Crypto       | ethereum-cryptography (secp256k1, keccak256) |
| API          | REST over HTTP                               |

## How signing works

1. Client builds a message: `{ sender, recipient, amount }` (JSON string)
2. Client hashes it with Keccak256 and signs the hash using the sender's private key, producing `signature` and `recovery` bit
3. Client sends `{ sender, recipient, amount, signature, recovery }` to the server
4. Server recomputes the hash, recovers the public key from `(hash, signature, recovery)`, derives the address, and verifies it matches `sender`
5. If valid and balances/validation pass, the transfer is applied

This prevents tampering: any change to recipient/amount alters the message hash, making the signature invalid for the claimed sender.

## Validation rules

- Address format must match `^0x[0-9a-fA-F]{40}$`
- Recipient must be a known address in `balances` (no auto-creation)
- Amount must be a positive number
- Signature must correspond to the `sender` for the exact `{ sender, recipient, amount }`

## Endpoints

- GET `/balance/:address`
  - Returns `{ balance }`

- POST `/verify`
  - Body: `{ sender, recipient, amount, signature, recovery }`
  - Returns: `{ valid, signer }` or `{ valid: false, message }`

- POST `/send`
  - Body: `{ sender, recipient, amount, signature, recovery }`
  - Verifies signature and validations, then moves balances
  - Returns: `{ balance }` (new sender balance)

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

## Notes

- The server holds an in-memory `balances` map; restart resets balances
- For production-grade use, add checksum validation, nonce/replay protection, and persistence

