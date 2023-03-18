import { Code, Container } from "@chakra-ui/react";
import { useEffect } from "react";

const EXTENSION_DOMAIN = "*"

type AllsearchMessage = string
type ExtensionMessage = string


const onMessageReceivedFromExtension = (e: MessageEvent<ExtensionMessage>) => {
  // Check to make sure that this message came from the correct domain.
  if (e.origin !== EXTENSION_DOMAIN)
    return;

  sendMessageToExtension("received!")
}

const sendMessageToExtension = (msg: AllsearchMessage) => {
  window.parent.postMessage(msg, EXTENSION_DOMAIN)
}


//This page is only meant to be used as an iframe in Allsearch's browser extension background script
export const PluginAnchor = () => {

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromExtension);
    return () => window.removeEventListener("message", onMessageReceivedFromExtension, false);
  }, [])

  return (
    <Container centerContent maxWidth={"80%"}>

      <Code >
        This is just here for Allsearch's addon. Nothing to see here!
      </Code>

    </Container>
  );
}
