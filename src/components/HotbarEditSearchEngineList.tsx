import { Button, Container, Heading, useDisclosure, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { customSearchEnginesTemplate, defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { SearchEngineCategoryId, SearchEngineDefinitionWithId, SearchEngineSet } from "../data/searchEngineTypes";
import { getCustomSearchEngineList } from "../utils/storage";
import { SearchEngineListElement } from "./HotbarEditSearchEngineListElement";
import SearchEngineEditModal from "./SearchEngineEditModal";

type SearchEngineListProps = {
    categoryId: SearchEngineCategoryId,
}

export const SearchEngineList: React.FC<SearchEngineListProps> = (props) => {

    const [engineList, setEngineList] = useState<SearchEngineSet>({});
    const { isOpen: isModalOpen, onOpen: setModalOpen, onClose: setModalClose } = useDisclosure()
    const [engineCurrentlyBeingEdited, setEngineCurrentlyBeingEdited]
        = useState<SearchEngineDefinitionWithId | undefined>(undefined)

    //The engine list part of engine categories are the only thing that's editable, so they're
    //The only thing that has to be linked to state, we can fetch everything else as  constants
    const category = React.useMemo(() => {
        return props.categoryId === "custom" ? customSearchEnginesTemplate : defaultSearchEngineCategories[props.categoryId]
    }, [props.categoryId])

    function updateStateWithFreshEngineList() {
        if (category.isCustomCategory) {
            setEngineList(getCustomSearchEngineList())
        } else {
            setEngineList(category.engines)
        }
    }

    function onSearchEngineEditRequested(engine: SearchEngineDefinitionWithId) {
        setEngineCurrentlyBeingEdited(engine)
        setModalOpen()
    }

    function onSearchEngineCreatedRequested() {
        setEngineCurrentlyBeingEdited(undefined)
        setModalOpen()
    }

    useEffect(() => {
        updateStateWithFreshEngineList()
        //Not necessary to add category to the list of dependencies since, whenever the
        //category's list is updated, updateWithNewEngineList is called by the updater
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.categoryId])

    return (
        <Container centerContent maxWidth={"100%"}>
            <Heading size="lg" margin="8px 0px 16px 0px">{category.description}</Heading>

            {category.isCustomCategory && (
                <Button onClick={onSearchEngineCreatedRequested}>Add</Button>
            )}

            <SearchEngineEditModal
                isOpen={isModalOpen}
                onClose={setModalClose}
                onSave={updateStateWithFreshEngineList}
                engine={engineCurrentlyBeingEdited}
            />

            <VStack width={"100%"} spacing="18px" >
                {Object.entries(engineList).map(x => {
                    return (
                        <SearchEngineListElement
                            key={x[0]}
                            engine={{ ...x[1], id: x[0] }}
                            canEdit={category.isCustomCategory ?? false}
                            onEngineDeleted={updateStateWithFreshEngineList}
                            onEditRequested={onSearchEngineEditRequested} />
                    )
                })}
            </VStack>
        </Container>
    )
}
