import {
    Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, useToast
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { EngineShortcut, QueryType, SearchEngineDefinitionWithId } from "../data/searchEngineTypes";
import { isUrl } from "../utils/utils";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";
import { v4 as uuidv4 } from 'uuid';
import { addCustomSearchEngine } from "../utils/storage";
import { useEffect } from "react";

interface ModalProps {
    engine?: SearchEngineDefinitionWithId,
    onSave: () => void
    isOpen: boolean
    onClose: () => void
}

const EngineModal: React.FC<ModalProps> = (props) => {

    const [nameInput, setNameInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [shortcutInput, setShortcutInput] = useState('')
    const [queryInput, setQueryInput] = useState('')
    const [logoUrlInput, setLogoUrlInput] = useState('')

    const [logoUrlInvalid, setLogoUrlInvalid] = useState(false)
    const [shortcutInvalid, setShortcutInvalid] = useState(false)
    const [queryInvalid, setQueryInvalid] = useState(false)
    const [nameInvalid, setNameInvalid] = useState(false)

    const checkIfLogoUrlInvalid = () => logoUrlInput.trim() !== "" && !isUrl(logoUrlInput.trim())
    const checkIfShortcutInvalid = () => shortcutInput.length !== 1 || !shortcutInput.match(/^[0-9a-z]+$/)
    const checkIfQueryInvalid = () => !queryInput.includes("{searchTerms}") || !isUrl(queryInput.trim())
    const checkIfNameInvalid = () => nameInput.trim() === ""

    const toast = useToast()

    function inEditMode(p: ModalProps): p is Required<ModalProps> {
        return p.engine !== undefined;
    }

    function attemptSave() {
        if (checkIfLogoUrlInvalid()) {
            setLogoUrlInvalid(true)
            return
        }
        if (checkIfNameInvalid()) {
            setNameInvalid(true)
            return
        }
        if (checkIfQueryInvalid()) {
            setQueryInvalid(true)
            return
        }
        if (checkIfShortcutInvalid()) {
            setShortcutInvalid(true)
            return
        }

        const newEngineWithId: SearchEngineDefinitionWithId = {
            id: inEditMode(props) ? props.engine.id : uuidv4(),
            name: nameInput.trim(),
            shortcut: shortcutInput as EngineShortcut,
            query: queryInput as QueryType
        }

        if (descriptionInput.trim()) newEngineWithId.description = descriptionInput.trim()
        if (logoUrlInput.trim()) newEngineWithId.logoUrl = logoUrlInput.trim()

        addCustomSearchEngine(newEngineWithId);
        if (props.onSave) props.onSave()

        toast({
            title: 'Saved!',
            description: inEditMode(props) ? "Your engine is updated" : "You can now add this engine to your Allsearch hotbar.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })

        props.onClose()
    }

    useEffect(() => {
        if (props.isOpen) {
            setNameInput(props.engine?.name ?? "")
            setDescriptionInput(props.engine?.description ?? "")
            setLogoUrlInput(props.engine?.logoUrl ?? "")
            setQueryInput(props.engine?.query ?? "")
            setShortcutInput(props.engine?.shortcut ?? "")
        }
    }, [props.engine, props.isOpen])

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="4xl">
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(20deg)'
            />
            <ModalContent>
                <ModalHeader>Custom Engine {inEditMode(props) ? "Editor" : "Creator"}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <FormControl isRequired isInvalid={nameInvalid} mb="4">
                        <FormLabel>Engine Name</FormLabel>
                        <Input
                            onChange={(e) => setNameInput(e.target.value)}
                            value={nameInput}
                            onBlur={() => setNameInvalid(checkIfNameInvalid())}
                        />
                        <FormErrorMessage>You gotta give the search engine a name!</FormErrorMessage>
                    </FormControl>

                    <FormControl mb="4">
                        <FormLabel>Engine Description</FormLabel>
                        <Input
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            value={descriptionInput}
                        />
                    </FormControl>

                    <FormControl isRequired mb="4" isInvalid={queryInvalid}>
                        <FormLabel>Engine Query</FormLabel>
                        <Input
                            onChange={(e) => setQueryInput(e.target.value)}
                            value={queryInput}
                            placeholder="https://example.com/search?q={searchTerms}"
                            onBlur={() => setQueryInvalid(checkIfQueryInvalid())}
                        />
                        <FormHelperText>URL with {"{searchTerms} in place of query"} </FormHelperText>
                        <FormErrorMessage>Looks like this isn't a valid search query template!</FormErrorMessage>
                    </FormControl>

                    <Flex direction={"row"} alignItems="center">
                        <FormControl mb="4" isInvalid={logoUrlInvalid}>
                            <FormLabel>Engine Logo Url</FormLabel>
                            <Input
                                onChange={(e) => setLogoUrlInput(e.target.value)}
                                value={logoUrlInput}
                                onBlur={() => setLogoUrlInvalid(checkIfLogoUrlInvalid())}
                            />
                            <FormHelperText>Smaller images are better for performance.</FormHelperText>
                            <FormErrorMessage>This isn't a valid URL!</FormErrorMessage>
                        </FormControl>
                        <EngineOrMacroLogo
                            size={65}
                            url={logoUrlInput.trim()}
                            marginRight="16px"
                            marginLeft="16px"
                        />
                    </Flex>

                    <FormControl mb="4" isRequired isInvalid={shortcutInvalid}>
                        <FormLabel>Shortcut (single letter)</FormLabel>
                        <Input
                            maxLength={1}
                            onChange={(e) => setShortcutInput(e.target.value)}
                            value={shortcutInput}
                            onBlur={() => setShortcutInvalid(checkIfShortcutInvalid())}
                        />
                        <FormHelperText>This is the shortcut used to use this Engine on the homepage.</FormHelperText>
                        <FormErrorMessage>Invalid Shortcut! Should be a-z or 0-9</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={attemptSave}>
                        Save
                    </Button>
                    <Button variant='ghost' onClick={props.onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default React.memo(EngineModal)
