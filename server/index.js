const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0xcff4ce4f6c88c8acc3f66ffbfe15b4e0a209048b": 100,
  "0xdeb2a9e1b09c9ea1cc95b7886c7466b51c75b8cb": 50,
  "0x4a5d3a926f9094d749035be4c3851712f22881d4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function hashMessage(message) {
  return keccak256(Buffer.from(message));
}

function publicKeyToAddress(publicKey) {
  const hash = keccak256(publicKey.slice(1));
  const addressBytes = hash.slice(-20);
  return "0x" + Buffer.from(addressBytes).toString("hex");
}

app.post("/verify", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;
  try {
    if (!signature && signature !== "") throw new Error("Missing signature");
    if (recovery === undefined || recovery === null) throw new Error("Missing recovery bit");

    const message = JSON.stringify({ sender, recipient, amount });
    const messageHash = hashMessage(message);

    const signatureBytes = hexToBytes(signature);
    const publicKey = secp.recoverPublicKey(messageHash, signatureBytes, recovery, false);
    const derivedAddress = publicKeyToAddress(publicKey);

    const valid = derivedAddress.toLowerCase() === String(sender).toLowerCase();
    return res.send({ valid, signer: derivedAddress });
  } catch (err) {
    return res.status(400).send({ valid: false, message: err.message || 'Verification failed' });
  }
});

function isValidAddress(address) {
  return typeof address === 'string' && /^0x[0-9a-fA-F]{40}$/.test(address);
}

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  try {
    if (!signature && signature !== "") throw new Error("Missing signature");
    if (recovery === undefined || recovery === null) throw new Error("Missing recovery bit");

    if (!isValidAddress(sender)) return res.status(400).send({ message: "Invalid sender address" });
    if (!isValidAddress(recipient)) return res.status(400).send({ message: "Invalid recipient address" });

    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).send({ message: "Invalid amount" });

    const message = JSON.stringify({ sender, recipient, amount });
    const messageHash = hashMessage(message);

    const signatureBytes = hexToBytes(signature);
    const publicKey = secp.recoverPublicKey(messageHash, signatureBytes, recovery, false);
    const derivedAddress = publicKeyToAddress(publicKey);

    if (derivedAddress.toLowerCase() !== String(sender).toLowerCase()) {
      return res.status(400).send({ message: "Invalid signature for sender" });
    }

    // Only allow transfers to known wallets (already in balances)
    if (!(recipient in balances)) {
      return res.status(400).send({ message: "Unknown recipient address" });
    }

    // Initialize sender if not present (do not auto-create recipient)
    if (!(sender in balances)) {
      balances[sender] = 0;
    }

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (err) {
    res.status(400).send({ message: err.message || 'Invalid transaction' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
