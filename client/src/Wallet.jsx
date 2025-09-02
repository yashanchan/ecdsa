import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
    try {
      // Check if private key is valid
      if (!privateKey || privateKey.length < 64) {
        setAddress("");
        setBalance(0);
        return;
      }
      
      // Generate proper address
      const publicKey = secp.getPublicKey(privateKey);
      const publicKeyHash = keccak256(publicKey.slice(1));
      const address = '0x' + toHex(publicKeyHash.slice(-20));
      
      setAddress(address);
      if (address) {
        const { data: { balance } } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Error generating address:", error);
      setAddress("");
      setBalance(0);
    }
  }
  
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      
      <label>
        Private Key
        <input 
          placeholder="Enter your private key"
          value={privateKey} 
          onChange={onChange}
        ></input>
      </label>
      
      <div>
        Address: {address || "..."} 
      </div>
      
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;