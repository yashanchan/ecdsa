const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log('PRIVATE KEY:', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log('PUBLIC KEY:', toHex(publicKey));

const publicKeyHash = keccak256(publicKey.slice(1));
const address = '0x' + toHex(publicKeyHash.slice(-20));
console.log('ADDRESS:', address);