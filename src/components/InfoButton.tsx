import { IconButton, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { recordInfoButtonPopoverShown, shouldShowInfoButtonPopover, showInfoButtonPopoverInNewUserMode } from "../utils/onboardingManager";

const InfoButton: React.FC = () => {
    const navigate = useNavigate();

    const { isOpen, onOpen: setPopoverOpen, onClose: setPopoverClose } = useDisclosure()

    //Should we show the popup with a design consistent with a new user, or an existing user with a new version
    const [openAsNewUser, setOpenAsNewUser] = useState(false)

    useEffect(() => {
        const shouldOpen = shouldShowInfoButtonPopover()
        if (shouldOpen){
            recordInfoButtonPopoverShown()
            setPopoverOpen()
            setOpenAsNewUser(showInfoButtonPopoverInNewUserMode())
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
                <PopoverHeader fontWeight='semibold'>
                    {openAsNewUser ? "Hello! New here?" : "We got some new stuff!"}
                </PopoverHeader>
                <PopoverArrow bg="salmon" />
                <PopoverCloseButton />
                <PopoverBody>
                    <Image
                        src={openAsNewUser ? require("../media/pusheen-hello.gif") :
                            require("../media/pusheen-cat-celebrate.gif")}

                        height={"120px"}
                        borderRadius="8px"
                    />

                    {openAsNewUser ?
                        (<Text color="black">
                            Learn some quick basics of Allsearch here! <i>Very short.</i>
                        </Text>) :
                        (<Text color="black">
                            We have some new features worth talking about.
                        </Text>)
                    }

                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default React.memo(InfoButton)
