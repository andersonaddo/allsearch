import { Button, Container, Heading, List, ListIcon, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md"

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
          Create macros which allow you to <b>use multiple engines simultaneously</b>
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Activate search engines by clicking on them or using their <b>shortcuts</b> (indicated by underlined text or [])
        </ListItem>

        <ListItem fontSize={"large"}>
          <ListIcon as={MdCheckCircle} color='green.500' />
          If you need to make Allsearch your default engine, our template is <b>https://allsear.ch/search?q=%s</b>
        </ListItem>
      </List>

      <Button onClick={() => navigate("/")} colorScheme="green" marginTop={"16px"}>Back</Button>
    </Container>
  );
}