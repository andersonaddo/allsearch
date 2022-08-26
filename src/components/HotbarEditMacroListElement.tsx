import { Checkbox, Container, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MacroDefinitionWithId } from "../types/searchEngineTypes";
import { addToHotbar, getHotbar, removeFromHotbar, removeMacro } from "../utils/storage";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";

type MacroListElementProps = {
    macro: MacroDefinitionWithId,
    onMacroDeleted: () => void,
    onEditRequested: (engine: MacroDefinitionWithId) => void
}

export const MacroListElement: React.FC<MacroListElementProps> = (props) => {

    const hotbar = useMemo(() => {
        return getHotbar();
    }, [])

    function onCheckStateChanged(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) addToHotbar(props.macro.id, "macro")
        else removeFromHotbar(props.macro.id)
    }

    function deleteMacro() {
        removeMacro(props.macro)
        props.onMacroDeleted()
    }

    return (
        <Container maxWidth={"90%"}>
            <Flex direction="row" alignItems={"center"}>
                <Checkbox
                    defaultChecked={props.macro.id in hotbar}
                    onChange={onCheckStateChanged}
                />

                <EngineOrMacroLogo
                    size={35}
                    info={props.macro}
                    marginRight="16px"
                    marginLeft="16px"
                    isMacro={true}
                />

                <Heading size={"md"} marginRight="16px" > {props.macro.name} </Heading>

                <Text marginRight="16px" > [{props.macro.shortcut}] </Text>

                <Text flex={1} fontSize="sm" textAlign={"left"} marginLeft="16px">
                    <i>{props.macro.description}</i>
                </Text>


                <IconButton
                    aria-label="Edit"
                    icon={<FiEdit />}
                    onClick={() => props.onEditRequested(props.macro)}
                    colorScheme="blue"
                    variant='ghost'
                    size='lg'
                />
                <IconButton
                    aria-label="Delete"
                    icon={<BsFillTrashFill />}
                    onClick={deleteMacro}
                    colorScheme="red"
                    variant='ghost'
                    size='lg'
                />

            </Flex>
        </Container >
    )
}
