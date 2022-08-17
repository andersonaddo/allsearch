import { Button, Container, Heading, List, ListIcon, ListItem, Text, Link } from "@chakra-ui/react";
import { MdCheckCircle, MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const About = () => {

  const navigate = useNavigate();

  return (
    <Container centerContent maxWidth={"80%"}>
      <Heading marginTop={"24px"}>About Allsearch</Heading>

      <Text margin={"16px"} fontSize={"large"}>
        Allsearch is a tool that's supposed to make it easier to start using other search engines
        other than Google. There's a whole lot more to the web than what Google can show you; Allsearch
        is meant to make it easier to see that.
      </Text>


      <List width={"100%"} spacing={3}>
        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Choose from Allsearch's default engines or <b>add your own.</b>
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Create macros which allow you to <b>use multiple engines simultaneously.</b>
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Activate search engines by clicking on them or using their <b>shortcuts</b> (indicated by underlined text or []).
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          If you want to make Allsearch your default engine, our template is
          <b>https://allsear.ch/search?q=%s</b>
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdWarning} color='red.500' />
          Keep in mind that some browsers will mistake engines activated by macros as popups and block them.<br/>
          You can find more about that from 
          <Link isExternal color='teal.500' href="https://support.google.com/chrome/answer/95472?hl=en&co=GENIE.Platform%3DDesktop"> Chrome's docs </Link>
          and 
          <Link isExternal color='teal.500' href="https://support.mozilla.org/en-US/kb/pop-blocker-settings-exceptions-troubleshooting"> Firefox's docs </Link>
          (only read the first few paragraphs).
        </ListItem>
      </List>

      <Button onClick={() => navigate("/")} colorScheme="green" marginTop={"16px"}>Back</Button>
    </Container>
  );
}