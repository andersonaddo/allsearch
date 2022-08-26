import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button
} from "@chakra-ui/react";
import * as React from "react";

interface InfoProps {
    message: string
    isOpen: boolean,
    onClose: () => void,
}

const GenericInfoDialogue: React.FC<InfoProps> = (props) => {

    //Based on WAI-ARIA specifications, focus should be placed on the
    //least destructive element when the dialog opens, to prevent users from 
    //accidentally confirming the destructive action.
    const cancelRef = React.useRef(null)
    return (
        <AlertDialog
            isOpen={props.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={props.onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Info
                    </AlertDialogHeader>

                    <AlertDialogBody whiteSpace={"pre-wrap"}>
                       {props.message}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            colorScheme='blue'
                            ref={cancelRef}
                            onClick={() => {
                                props.onClose()
                            }} ml={3}>
                            Ok
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default React.memo(GenericInfoDialogue)
