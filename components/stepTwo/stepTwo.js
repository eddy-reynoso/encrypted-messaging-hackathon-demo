import React, { useEffect } from "react";
import { Button, Heading, Input } from "@chakra-ui/react";
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
  } = props;
  const { data: getWalletsData } = useMoralisQuery(
    "Wallet",
    (query) => query,
    [],
    {
      live: true,
    }
  );

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
          label: wallet.get("address"),
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
      <Heading color="teal">Step Two: Send a Message</Heading>
      {pickerItems.length > 0 && (
        <CUIAutoComplete
          placeholder="Type an Address"
          onCreateItem={handleCreateItem}
          items={pickerItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />
      )}
      <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={() => sendMessage()}>Send Message</Button>
    </>
  );
};

export default StepTwo;
