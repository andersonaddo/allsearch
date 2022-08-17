import { IconButton, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { recordInfoButtonPopoverShown, shouldShowInfoButtonPopover } from "../utils/onboardingManager";

const InfoButton: React.FC = () => {
    const navigate = useNavigate();

    const { isOpen, onOpen: setPopoverOpen, onClose: setPopoverClose } = useDisclosure()

    useEffect(() => {
        const shouldOpen = shouldShowInfoButtonPopover()
        if (shouldOpen){
            recordInfoButtonPopoverShown()
            setPopoverOpen()
        }
    }, [setPopoverOpen])

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={setPopoverClose}
            placement='bottom'
            closeOnBlur={false}
            //https://github.com/chakra-ui/chakra-ui/issues/4109
            //https://github.com/chakra-ui/chakra-ui/issues/3814#issuecomment-864328519
            strategy='fixed' 
        >
            <PopoverTrigger>
                <IconButton
                    aria-label="About Allsearch"
                    icon={<BiHelpCircle />}
                    onClick={() => {
                        setPopoverClose()
                        navigate("./about")
                    }}
                    variant='ghost'
                />
            </PopoverTrigger>
            <PopoverContent bg="salmon" color="black" >
                <PopoverHeader fontWeight='semibold'>Hello! New here?</PopoverHeader>
                <PopoverArrow bg="salmon" />
                <PopoverCloseButton />
                <PopoverBody>
                    <Image
                        src={require("../media/pusheen-hello.gif")}
                        height={"120px"}
                        borderRadius="8px"
                    />
                    <Text color="black">
                        Learn some quick basics of Allsearch here! <i>Very short.</i>
                    </Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default React.memo(InfoButton)
