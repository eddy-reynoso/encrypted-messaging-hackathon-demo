import React, { useEffect } from "react";
import { Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useMoralisCloudFunction, useMoralisQuery } from "react-moralis";
import { decrypt } from "../../utilities/helper";

const StepThree = (props) => {
  const { messages, setMessages, address, privateKey } = props;
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
      <div
        style={{
          width: "100%",
          margin: "auto",
          overflow: "scroll",
          textOverflow: "truncate",
        }}
      >
        <Table variant="simple" overflow="hidden" textOverflow="truncate">
          <Thead>
            <Tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Message</Th>
            </Tr>
          </Thead>
          <Tbody textOverflow="truncate">
            {messages.map((message) => {
              return (
                <Tr key={message.message}>
                  <Td>{message.from}</Td>
                  <Td>{message.to}</Td>

                  <Td textOverflow="truncate">{message.message}</Td>
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
