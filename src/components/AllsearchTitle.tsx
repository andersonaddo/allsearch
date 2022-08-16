import { Heading } from "@chakra-ui/react";
import * as React from "react";

const AllsearchTitle: React.FC = () => {
    return (
        <Heading 
        as='h1' 
        size='4xl'
        textShadow="0px 0px 40px rgba(0,0,0, 0.35)">
            AllSearch
        </Heading>
    )
}

export default React.memo(AllsearchTitle)
