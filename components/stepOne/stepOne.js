import React, { useEffect } from "react";
import { Button, Heading, Text } from "@chakra-ui/react";
import { useMoralisCloudFunction } from "react-moralis";
import Wallet from "ethereumjs-wallet";

const StepOne = (props) => {
  const {
    privateKey,
    publicKey,
    address,
    setPrivateKey,
    setPublicKey,
    setAddress,
    web3,
  } = props;

  const { fetch: saveWalletFetch } = useMoralisCloudFunction(
    "saveWallet",
    { publicKey, address },
    { autoFetch: false }
  );

  useEffect(async () => {
    const localUser = localStorage.getItem("user");

    if (!localUser && publicKey.length > 0) {
      await saveWalletFetch().then(() => {
        const localUser = { address, publicKey, privateKey };
        localStorage.setItem("user", JSON.stringify(localUser));
      });
    }
  }, [publicKey]);

  const createAccount = () => {
    const { address, privateKey } = web3.eth.accounts.create();

    const privateKeyBuffer = Buffer.from(privateKey.substring(2, 66), "hex");
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
    const publicKey = wallet.getPublicKeyString();

    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    setAddress(address);
  };
  return (
    <>
      <Heading color="teal">Step One: Create Your Wallet</Heading>
      <Button onClick={() => createAccount()}>Create Account</Button>
      <Text>Private Key: {privateKey}</Text>
      <Text>Public Key: {publicKey}</Text>
      <Text>Address: {address}</Text>
    </>
  );
};

export default StepOne;
