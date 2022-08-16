import { Checkbox, Container, Flex, Text } from "@chakra-ui/react";
import { SearchEngineDefinitionWithId, SearchEngineId } from "../data/searchEngineTypes";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";

type MacroListElementProps = {
    engine: SearchEngineDefinitionWithId
    isChecked: boolean,
    onCheckStateChanged: (newStateChecked: boolean, id: SearchEngineId) => void
}

export const MacroModalEngineListElement: React.FC<MacroListElementProps> = (props) => {

    return (
        <Container maxWidth={"90%"}>
            <Flex direction="row">
                <Checkbox
                    isChecked={props.isChecked}
                    onChange={event => props.onCheckStateChanged(event.target.checked, props.engine.id)}
                />

                <EngineOrMacroLogo
                    size={20}
                    info={props.engine}
                    marginRight="16px"
                    marginLeft="16px"
                    isMacro={true}
                />

                <Text marginRight="16px" > {props.engine.name} </Text>

            </Flex>
        </Container>
    )
}
