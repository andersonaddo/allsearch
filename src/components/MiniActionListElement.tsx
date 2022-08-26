import { Checkbox, Container, Flex, Text } from "@chakra-ui/react";
import { MacroDefinitionWithId, SearchEngineDefinitionWithId, SearchEngineId } from "../types/searchEngineTypes";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";

type ActionListElementProps = {
    action: SearchEngineDefinitionWithId | MacroDefinitionWithId
    isChecked: boolean,
    onCheckStateChanged: (newStateChecked: boolean, id: SearchEngineId) => void
    isMacro?: boolean
}

export const MiniActionListElement: React.FC<ActionListElementProps> = (props) => {

    return (
        <Container maxWidth={"90%"}>
            <Flex direction="row">
                <Checkbox
                    isChecked={props.isChecked}
                    onChange={event => props.onCheckStateChanged(event.target.checked, props.action.id)}
                />

                <EngineOrMacroLogo
                    size={20}
                    info={props.action}
                    marginRight="16px"
                    marginLeft="16px"
                    isMacro={props.isMacro}
                />

                <Text marginRight="16px" > {props.action.name} </Text>

            </Flex>
        </Container>
    )
}
