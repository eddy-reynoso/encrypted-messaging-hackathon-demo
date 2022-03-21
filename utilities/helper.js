import EthCrypto from "eth-crypto";

export const encrypt = async (message, publicKey, privateKey) => {
  const signature = EthCrypto.sign(
    privateKey,
    EthCrypto.hash.keccak256(message)
  );
  const payload = {
    message,
    signature,
  };

  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKey.substring(2),
    JSON.stringify(payload)
  );

  const encryptedString = EthCrypto.cipher.stringify(encrypted);
  return encryptedString;
};

export const decrypt = async (encryptedString, privateKey) => {
  const encryptedObject = EthCrypto.cipher.parse(encryptedString);
  const decrypted = await EthCrypto.decryptWithPrivateKey(
    privateKey,
    encryptedObject
  );
  const decryptedPayload = JSON.parse(decrypted);
  /*
  const senderAddress = EthCrypto.recover(
    decryptedPayload.signature,
    EthCrypto.hash.keccak256(decryptedPayload.message)
  );
*/
  return decryptedPayload.message;
};
