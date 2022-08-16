import { Button, Container, Heading, useDisclosure, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { MacroDefinitionWithId, MacroSet } from "../data/searchEngineTypes";
import { getMacros } from "../utils/storage";
import { MacroListElement } from "./HotbarEditMacroListElement";
import MacroEditModal from "./MacroEditModal";

export const MacroList: React.FC = (props) => {

    const [macroList, setMacroList] = useState<MacroSet>({});
    const { isOpen: isModalOpen, onOpen: setModalOpen, onClose: setModalClose } = useDisclosure()
    const [macroCurrentlyBeingEdited, setMacroCurrentlyBeingEdited]
        = useState<MacroDefinitionWithId | undefined>(undefined)

    function updateStateWithFreshMacroList() {
        setMacroList(getMacros())
    }

    function onMacroEditRequested(macro: MacroDefinitionWithId) {
        setMacroCurrentlyBeingEdited(macro)
        setModalOpen()
    }

    function onSearchEngineCreatedRequested() {
        setMacroCurrentlyBeingEdited(undefined)
        setModalOpen()
    }

    useEffect(() => {
        updateStateWithFreshMacroList()
    }, [])

    return (
        <Container centerContent maxWidth={"100%"}>
            <Heading size="lg" margin="8px 0px 16px 0px">
                Search Engine Macros
            </Heading>
            <Heading as="h4" size="sm" margin="0px 0px 16px 0px">
                Use these to define sets of search engines you want to activate at once.
                <br />
                For example, define a combination you'd want to use simultaneously when looking for images.
            </Heading>

            <Button onClick={onSearchEngineCreatedRequested}>Add</Button>

            <MacroEditModal
                isOpen={isModalOpen}
                onClose={setModalClose}
                onSave={updateStateWithFreshMacroList}
                macro={macroCurrentlyBeingEdited}
            />

            <VStack width={"100%"} spacing="18px" >
                {Object.entries(macroList).map(x => {
                    return (
                        <MacroListElement
                            key={x[0]}
                            macro={{ ...x[1], id: x[0] }}
                            onMacroDeleted={updateStateWithFreshMacroList}
                            onEditRequested={onMacroEditRequested} />
                    )
                })}
            </VStack>
        </Container>
    )
}
