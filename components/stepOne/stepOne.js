import React, { useEffect, useState } from "react";
import { Button, Heading, Text, Stack, Divider, Input } from "@chakra-ui/react";
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
    username,
    setUsername,
    usernameText,
    setUsernameText,
  } = props;
  const { fetch: saveWalletFetch } = useMoralisCloudFunction(
    "saveWallet",
    { publicKey, address, username },
    { autoFetch: false }
  );

  useEffect(async () => {
    const localUser = localStorage.getItem("user");

    if (!localUser && publicKey.length > 0) {
      await saveWalletFetch().then(() => {
        const localUser = { address, publicKey, privateKey, username };
        localStorage.setItem("user", JSON.stringify(localUser));
        setUsername("");
      });
    }
  }, [publicKey, username]);

  const createAccount = () => {
    const { address, privateKey } = web3.eth.accounts.create();

    const privateKeyBuffer = Buffer.from(privateKey.substring(2, 66), "hex");
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
    const publicKey = wallet.getPublicKeyString();

    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    setAddress(address);
    setUsernameText(username);
  };
  const createAccountDisabled = publicKey !== "";
  return (
    <>
      <Stack style={{ width: "100%" }} pb={8}>
        <Heading color="teal" width="100%" textAlign="center">
          Wallet Info
        </Heading>

        <Text color="teal">
          <strong>Private Key</strong> (Random 256 bit hexadecimal value
          generated using SHA-256.)
        </Text>
        <Text>{privateKey}</Text>
        <Text color="teal">
          <strong>Public Key</strong> (528 bit hexadecimal value generated using
          Private Key and Elliptic Curve Digital Signature Algorithm.)
        </Text>
        <Text>{publicKey}</Text>

        <Text color="teal">
          <strong>Address</strong> (160 bit hexadecimal value generated using
          the last 40 characters of the the Keccak-256 hash of the Public Key.)
        </Text>
        <Text>{address}</Text>
        <Text color="teal">
          <strong>Username</strong> (User friendly string that maps to address)
        </Text>
        <Text>{usernameText}</Text>
        <Divider />
        <Heading
          color="teal"
          style={
            createAccountDisabled ? { textDecoration: "line-through" } : {}
          }
          textAlign="center"
        >
          Step One: Create Your Wallet
        </Heading>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (Optional)"
        />
        <Button
          onClick={() => createAccount()}
          disabled={createAccountDisabled}
          width="100%"
        >
          Create Wallet
        </Button>
        <Divider />
      </Stack>
    </>
  );
};

export default StepOne;
