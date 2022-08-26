import { Text } from "@chakra-ui/react";
import * as React from "react";
import { TextProps } from "@chakra-ui/react";

const Footer: React.FC<TextProps> = (props) => {
    return (
        <Text align="right" margin="8px" fontSize="sm" {...props}>
            Allsearch - opening the world of search. 👋🏾 from 🇰🇷
        </Text>
    )
}

export default React.memo(Footer)
