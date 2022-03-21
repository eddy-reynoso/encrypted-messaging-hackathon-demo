import React, { useEffect } from "react";
import { Button, Heading, Input, Stack, Divider } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useMoralisQuery, useMoralisCloudFunction } from "react-moralis";

const StepTwo = (props) => {
  const {
    pickerItems,
    setPickerItems,
    selectedItems,
    setSelectedItems,
    message,
    setMessage,
    sendMessage,
    newMessages,
    setNewMessages,
    getWalletsData,
  } = props;

  const { fetch: saveMessagesFetch } = useMoralisCloudFunction(
    "saveMessages",
    { messages: newMessages },
    { autoFetch: false }
  );
  useEffect(async () => {
    if (newMessages && newMessages.length > 0) {
      await saveMessagesFetch();
      setNewMessages([]);
    }
  }, [newMessages]);

  useEffect(() => {
    if (getWalletsData) {
      const pickerItems = getWalletsData.map((wallet) => {
        return {
          ...wallet,
          label: wallet.get("username")
            ? `${wallet.get("username")} (${wallet.get("address")})`
            : wallet.get("address"),
          to: wallet.get("address"),
          value: wallet.get("publicKey"),
        };
      });
      setPickerItems([...pickerItems]);
    }
  }, [getWalletsData]);

  const handleCreateItem = (item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };
  return (
    <>
      <Stack style={{ width: "100%" }} pb={8}>
        <Heading color="teal" width="100%" textAlign="center">
          Step Two: Send a Message
        </Heading>
        {pickerItems.length > 0 && (
          <CUIAutoComplete
            placeholder="Select Address"
            onCreateItem={handleCreateItem}
            items={pickerItems}
            selectedItems={selectedItems}
            onSelectedItemsChange={(changes) =>
              handleSelectedItemsChange(changes.selectedItems)
            }
          />
        )}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />
        <Button
          onClick={() => sendMessage()}
          disabled={message.length === 0 || selectedItems.length === 0}
        >
          Send Message
        </Button>
        <Divider />
      </Stack>
    </>
  );
};

export default StepTwo;
