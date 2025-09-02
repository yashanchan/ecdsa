import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  function isValidAddress(addr) {
    return typeof addr === 'string' && /^0x[0-9a-fA-F]{40}$/.test(addr);
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);
      if (!privateKey) throw new Error('Missing private key');
      if (!address) throw new Error('Missing sender address');
      if (!recipient) throw new Error('Missing recipient');
      if (!isValidAddress(recipient)) throw new Error('Invalid recipient address');
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Invalid amount');

      const message = JSON.stringify({ sender: address, recipient, amount });
      const messageHash = hashMessage(message);
      const [signature, recovery] = await secp.sign(messageHash, privateKey, { recovered: true, der: false });

      const { data: { balance } } = await server.post(`send`, {
        sender: address,
        amount,
        recipient,
        signature: toHex(signature),
        recovery,
      });
      setBalance(balance);
    } catch (ex) {
      const msg = ex?.response?.data?.message || ex.message || 'Transaction failed';
      alert(msg);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x..."
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
