import { Link, Text } from "@chakra-ui/react";
import * as React from "react";
import { TextProps } from "@chakra-ui/react";

const Footer: React.FC<TextProps> = (props) => {
    return (
        <Text align="right" margin="8px 24px" fontSize="sm" {...props}>
            Allsearch - opening the world of search. <Link isExternal color='teal.500' href="https://github.com/andersonaddo/allsearch">
                Open Source.
            </Link> 👋🏾 from 🇰🇷
        </Text>
    )
}

export default React.memo(Footer)
