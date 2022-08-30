import {
    AlertDialog, AlertDialogBody, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button
} from "@chakra-ui/react";
import * as React from "react";

interface WarningProps {
    message?: string
    title?: string
    children?: JSX.Element
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void
}

const GenericWarningDialogue: React.FC<WarningProps> = (props) => {

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
                        {props.title ?? "Are you sure?"}
                    </AlertDialogHeader>

                    <AlertDialogBody whiteSpace={"pre-wrap"}>
                        {props.message}
                        {props.children}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={props.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={() => {
                            props.onClose()
                            props.onConfirm()
                        }} ml={3}>
                            Go Ahead
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default React.memo(GenericWarningDialogue)
