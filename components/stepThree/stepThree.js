import React, { useEffect, useState } from "react";
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  HStack,
  Text,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { useMoralisCloudFunction, useMoralisQuery } from "react-moralis";
import { decrypt } from "../../utilities/helper";

const StepThree = (props) => {
  const { messages, setMessages, address, privateKey, usernameMap } = props;
  const [onlyUser, setOnlyUser] = useState(false);

  const { data: getMessagesData } = useMoralisQuery(
    "Message",
    (query) => query,
    [],
    {
      live: true,
    }
  );
  useEffect(async () => {
    if (getMessagesData && getMessagesData.length > 0) {
      const messageRows = Promise.all(
        getMessagesData.map(async (messageRow) => {
          return {
            from: messageRow.get("from"),
            to: messageRow.get("to"),
            message:
              messageRow.get("to") === address
                ? await decrypt(messageRow.get("message"), privateKey)
                : messageRow.get("message"),
          };
        })
      );

      messageRows.then((rows) => {
        setMessages([...rows]);
      });
    }
  }, [getMessagesData]);

  return (
    <>
      <Heading color="teal">Step Three: View Messages</Heading>
      <Stack>
        <Checkbox
          checked={onlyUser}
          onChange={(e) => setOnlyUser(e.target.checked)}
          size="lg"
          colorScheme="teal"
        >
          Only Show My Messages
        </Checkbox>
      </Stack>
      <HStack
        width="100%"
        display="flex"
        color="teal"
        textAlign="left"
        pt={4}
        pb={4}
        fontWeight="bold"
      >
        <Text flex="1">From</Text>
        <Text flex="1">To</Text>
        <Text flex="1">Message</Text>
      </HStack>
      <div
        style={{
          width: "100%",
          margin: "auto",
          overflow: "scroll",
          textOverflow: "truncate",
          maxHeight: "600px",
        }}
      >
        <Table variant="simple" overflow="hidden" textOverflow="truncate">
          <Tbody textOverflow="truncate">
            {messages
              .filter((message) => {
                if (!onlyUser) {
                  return true;
                } else if (message.to === address || message.from === address) {
                  return true;
                }
                return false;
              })
              .map((message, index) => {
                const isReceiver = message.to === address;
                const isSender = message.from === address;

                return (
                  <Tr
                    key={`${message.from}-${message.to}-${message.message}-${index}`}
                  >
                    <Td
                      maxWidth="300"
                      backgroundColor={isSender ? "teal" : "white"}
                    >
                      {message.from in usernameMap
                        ? usernameMap[message.from]
                        : message.from}
                    </Td>
                    <Td
                      maxWidth="300"
                      backgroundColor={isReceiver ? "teal" : "white"}
                    >
                      {message.to in usernameMap
                        ? usernameMap[message.to]
                        : message.to}
                    </Td>

                    <Td textOverflow="ellipsis" maxWidth="300">
                      {message.message}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </div>
    </>
  );
};

export default StepThree;
