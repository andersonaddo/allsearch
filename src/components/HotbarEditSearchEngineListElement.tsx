import { Checkbox, Container, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { SearchEngineDefinitionWithId } from "../data/searchEngineTypes";
import { addToHotbar, getHotbar, removeCustomSearchEngine, removeFromHotbar } from "../utils/storage";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";

type SearchEngineListElementProps = {
    engine: SearchEngineDefinitionWithId,
    canEdit: boolean,
    onEngineDeleted: () => void,
    onEditRequested: (engine: SearchEngineDefinitionWithId) => void
}

export const SearchEngineListElement: React.FC<SearchEngineListElementProps> = (props) => {

    const hotbar = useMemo(() => {
        return getHotbar();
    }, [])

    function onCheckStateChanged(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) addToHotbar(props.engine.id, "engine")
        else removeFromHotbar(props.engine.id)
    }

    function deleteSearchEngine() {
        removeCustomSearchEngine(props.engine)
        props.onEngineDeleted()
    }

    return (
        <Container maxWidth={"90%"}>
            <Flex direction="row" alignItems={"center"}>
                <Checkbox
                    defaultChecked={props.engine.id in hotbar}
                    onChange={onCheckStateChanged}
                />

                <EngineOrMacroLogo
                    size={35}
                    info={props.engine}
                    marginRight="16px"
                    marginLeft="16px"
                />

                <Heading size={"md"} marginRight="16px" > {props.engine.name} </Heading>

                <Text marginRight="16px" > [{props.engine.shortcut}] </Text>

                <Text flex={1} fontSize="sm" textAlign={"left"} marginLeft="16px">
                    <i>{props.engine.description}</i>
                </Text>

                {props.canEdit && (
                    <>
                        <IconButton
                            aria-label="Edit"
                            icon={<FiEdit />}
                            onClick={() => props.onEditRequested(props.engine)}
                            colorScheme="blue"
                            variant='ghost'
                            size='lg'
                        />
                        <IconButton
                            aria-label="Delete"
                            icon={<BsFillTrashFill />}
                            onClick={deleteSearchEngine}
                            colorScheme="red"
                            variant='ghost'
                            size='lg'
                        />
                    </>
                )}

            </Flex>
        </Container>
    )
}
