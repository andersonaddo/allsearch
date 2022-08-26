import { Checkbox, Code, Container, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AnyRule, ruleIsAutoActivation, ruleIsStringReplacement } from "../types/rulesTypes";
import { addToActiveRules, getActiveRules, removeFromActiveRules, removeRule } from "../utils/storage";
import { EnrichTypeWithId, getMacroFromId, getSearchEngineFromId } from "../utils/utils";

type MacroListElementProps = {
    rule: EnrichTypeWithId<AnyRule>,
    onRuleDeleted: () => void,
    onEditRequested: (rule: EnrichTypeWithId<AnyRule>) => void
}

export const RuleListElement: React.FC<MacroListElementProps> = (props) => {

    const shouldDefaultChecked = useMemo(() => {
        const activeRules = getActiveRules()
        if (ruleIsStringReplacement(props.rule)) return !!activeRules.stringReplacement[props.rule.id]
        if (ruleIsAutoActivation(props.rule)) return !!activeRules.autoActivation[props.rule.id]
        return false;
    }, [props.rule])

    function onCheckStateChanged(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) addToActiveRules(props.rule.id, props.rule.ruleType)
        else removeFromActiveRules(props.rule.id)
    }

    function deleteRule() {
        removeRule(props.rule)
        props.onRuleDeleted()
    }

    function generateRuleSummary() {
        if (ruleIsStringReplacement(props.rule)) {
            return (
                <>
                    Replace <Code>{props.rule.triggerStrings[0]}</Code>
                    {props.rule.triggerStrings.length > 1 ? "and others " : " "}
                    with <Code>{props.rule.replacer}</Code>
                </>
            )
        }

        if (ruleIsAutoActivation(props.rule)) {
            const targetEngine = getSearchEngineFromId(props.rule.autoActivatedAction)?.name
            const targetMacro = getMacroFromId(props.rule.autoActivatedAction)?.name

            return (
                <>
                    Trigger the <Code>{targetEngine || targetMacro}</Code>
                    {!!targetEngine ? " engine " : " macro "}
                    when <Code>{props.rule.triggerStrings[0]}</Code>
                    {props.rule.triggerStrings.length > 1 ? "or others are present" : " is present"}
                </>
            )
        }
    }

    return (
        <Container maxWidth={"90%"}>
            <Flex direction="row" alignItems={"center"}>
                <Checkbox
                    defaultChecked={shouldDefaultChecked}
                    onChange={onCheckStateChanged}
                />

                <Heading size={"sm"} marginLeft="16px">
                    {props.rule.ruleType === "autoActivation" ? "[Action] " : "[String] "}
                    {props.rule.name ?? "Unnamed rule"}
                </Heading>

                <Text flex={1} fontSize="sm" textAlign={"left"} marginLeft="16px">
                    <i>{generateRuleSummary()}</i>
                </Text>


                <IconButton
                    aria-label="Edit"
                    icon={<FiEdit />}
                    onClick={() => props.onEditRequested(props.rule)}
                    colorScheme="blue"
                    variant='ghost'
                    size='lg'
                />
                <IconButton
                    aria-label="Delete"
                    icon={<BsFillTrashFill />}
                    onClick={deleteRule}
                    colorScheme="red"
                    variant='ghost'
                    size='lg'
                />

            </Flex>
        </Container >
    )
}
