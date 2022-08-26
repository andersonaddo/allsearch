import {
    Button, Container, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, useToast, VStack
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { MacroId, EngineShortcut, SearchEngineId, MacroDefinitionWithId, SearchEngineSet } from "../types/searchEngineTypes";
import { addMacro, getCustomSearchEngineList } from "../utils/storage";
import { isUrl, isValidShortcut } from "../utils/utils";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";
import { MiniActionListElement } from "./MiniActionListElement";
import { v4 as uuidv4 } from 'uuid';


interface ModalProps {
    macro?: MacroDefinitionWithId,
    onSave: () => void
    isOpen: boolean
    onClose: () => void
}

const MacroModal: React.FC<ModalProps> = (props) => {

    const [exhaustiveSearchEngineList, setExhaustiveSearchEngineList] = useState<SearchEngineSet>({})
    const [selectedSearchEngines, setSelectedSearchEngines] = useState<Record<MacroId, true>>({})

    const [nameInput, setNameInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [shortcutInput, setShortcutInput] = useState('')
    const [logoUrlInput, setLogoUrlInput] = useState('')

    const [logoUrlInvalid, setLogoUrlInvalid] = useState(false)
    const [shortcutInvalid, setShortcutInvalid] = useState(false)
    const [nameInvalid, setNameInvalid] = useState(false)
    const [engineSelectionInvalid, setEngineSelectionInvalid] = useState(false)

    const checkIfLogoUrlInvalid = () => logoUrlInput.trim() !== "" && !isUrl(logoUrlInput.trim())
    const checkIfEngineSelectionInvalid = () => Object.keys(selectedSearchEngines).length === 0;
    const checkIfShortcutInvalid = () => shortcutInput.length !== 1 || !isValidShortcut(shortcutInput)
    const checkIfNameInvalid = () => nameInput.trim() === ""

    const toast = useToast()

    function inEditMode(p: ModalProps): p is Required<ModalProps> {
        return p.macro !== undefined;
    }

    function getExhaustiveSearchEngineList() {
        let completeList: SearchEngineSet = {}
        const categories = Object.values(defaultSearchEngineCategories)
        for (const category of categories)
            completeList = { ...completeList, ...category.engines }

        const customEngines = getCustomSearchEngineList();
        completeList = { ...completeList, ...customEngines }
        setExhaustiveSearchEngineList(completeList)
    }

    function onEngineSelectionChanged(newStateChecked: boolean, id: SearchEngineId): void {
        const copiedSelection = { ...selectedSearchEngines }
        if (newStateChecked) {
            copiedSelection[id] = true;
        } else {
            delete copiedSelection[id]
        }
        setSelectedSearchEngines(copiedSelection)
    }


    function attemptSave() {

        if (checkIfNameInvalid()) {
            setNameInvalid(true)
            return
        }

        if (checkIfLogoUrlInvalid()) {
            setLogoUrlInvalid(true)
            return
        }

        if (checkIfShortcutInvalid()) {
            setShortcutInvalid(true)
            return
        }

        if (checkIfEngineSelectionInvalid()) {
            setEngineSelectionInvalid(true)
            return
        }

        const newMacroWithId: MacroDefinitionWithId = {
            id: inEditMode(props) ? props.macro.id : uuidv4(),
            name: nameInput.trim(),
            shortcut: shortcutInput as EngineShortcut,
            engines: selectedSearchEngines
        }

        if (descriptionInput.trim()) newMacroWithId.description = descriptionInput.trim()
        if (logoUrlInput.trim()) newMacroWithId.logoUrl = logoUrlInput.trim()

        addMacro(newMacroWithId);
        if (props.onSave) props.onSave()

        toast({
            title: 'Saved!',
            description: inEditMode(props) ? "Your macro is updated" : "You can now add this macro to your Allsearch hotbar.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })

        props.onClose()
    }

    useEffect(() => {
        if (props.isOpen) {
            setNameInput(props.macro?.name ?? "")
            setDescriptionInput(props.macro?.description ?? "")
            setLogoUrlInput(props.macro?.logoUrl ?? "")
            setShortcutInput(props.macro?.shortcut ?? "")
            setSelectedSearchEngines(props.macro?.engines ?? {})
            getExhaustiveSearchEngineList()
        }
    }, [props.macro, props.isOpen])


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
                        <FormLabel>Macro Name</FormLabel>
                        <Input
                            onChange={(e) => setNameInput(e.target.value)}
                            value={nameInput}
                            onBlur={() => setNameInvalid(checkIfNameInvalid())}
                        />
                        <FormErrorMessage>You gotta give the macro a name!</FormErrorMessage>
                    </FormControl>

                    <FormControl mb="4">
                        <FormLabel>Engine Description</FormLabel>
                        <Input
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            value={descriptionInput}
                        />
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
                            isMacro={true}
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

                    <FormControl mb="4" isRequired isInvalid={engineSelectionInvalid}>
                        <FormLabel>Search Engines</FormLabel>
                        <Container
                            borderColor={"grey"}
                            borderWidth={1} w="80%" maxHeight="150px"
                            overflow={"scroll"}
                            borderRadius="8px"
                        >
                            <VStack width={"100%"} spacing="8px" >
                                {Object.entries(exhaustiveSearchEngineList).map(engine => {
                                    return <MiniActionListElement
                                        action={{ ...engine[1], id: engine[0] }}
                                        key={engine[0]}
                                        isChecked={selectedSearchEngines[engine[0]] ?? false}
                                        onCheckStateChanged={onEngineSelectionChanged}
                                    />
                                })}
                            </VStack>
                            
                        </Container>
                        <FormErrorMessage>You have to choose at least one engine!</FormErrorMessage>
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

export default React.memo(MacroModal)

