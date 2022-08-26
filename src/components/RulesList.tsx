import { Button, Code, Container, Heading, HStack, useDisclosure, VStack, Text } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { AnyRule, RuleId, RuleType } from "../types/rulesTypes";
import { getRules } from "../utils/storage";
import { EnrichTypeWithId } from "../utils/utils";
import RuleEditModal from "./RuleEditModal";
import { RuleListElement } from "./RuleListElement";

export const RulesList: React.FC = () => {

    const [rulesList, setRulesList] = useState<Record<RuleId, AnyRule>>({});
    const { isOpen: isModalOpen, onOpen: setModalOpen, onClose: setModalClose } = useDisclosure()
    const [ruleCurrentlyBeingEdited, setRuleCurrentlyBeingEdited]
        = useState<EnrichTypeWithId<AnyRule> | undefined>(undefined)
    const [ruleCreationMode, setRuleCreationMode] = useState<RuleType>("autoActivation")

    function updateStateWithFreshRuleList() {
        const rulesList = getRules();
        let flattenedRulesList: Record<RuleId, AnyRule> = {}
        for (const ruleCategory of Object.values(rulesList)) flattenedRulesList = { ...flattenedRulesList, ...ruleCategory }
        setRulesList(flattenedRulesList)
    }

    function onRuleEditRequested(rule: EnrichTypeWithId<AnyRule>) {
        setRuleCurrentlyBeingEdited(rule)
        setModalOpen()
    }

    function onActionRuleCreationRequested() {
        setRuleCurrentlyBeingEdited(undefined)
        setRuleCreationMode("autoActivation")
        setModalOpen()
    }

    function onStringRuleCreationRequested() {
        setRuleCurrentlyBeingEdited(undefined)
        setRuleCreationMode("stringReplacement")
        setModalOpen()
    }

    useEffect(() => {
        updateStateWithFreshRuleList()
    }, [])

    return (
        <Container centerContent maxWidth={"100%"}>
            <Heading size="lg" margin="8px 0px 16px 0px">
                Allsearch Rules
            </Heading>
            <Text  size="sm">
                <b>Action Rules can be used to automatically trigger particular engines or macros based on the contents of your search.</b>
                <br />
                For example, any search with <Code>near me</Code> can be set to open in Bing Maps.
                <br />
                <b>String Rules can be used to automatically format your search queries. </b>
                <br />
                For example, replace instances of <Code>/r</Code> with <Code>site:reddit.com</Code>.
            </Text>

            <Text margin="0px 0px 16px 0px">
                Check the checkbox next to a rule to turn it on. 
                Note that all String Rules are applied before Action Rules; rules can be chained.
            </Text>

            <HStack>
                <Button onClick={onStringRuleCreationRequested}>New String Rule</Button>
                <Button onClick={onActionRuleCreationRequested}>New Action Rule</Button>
            </HStack>


            <RuleEditModal
                isOpen={isModalOpen}
                onClose={setModalClose}
                onSave={updateStateWithFreshRuleList}
                rule={ruleCurrentlyBeingEdited}
                mode={ruleCurrentlyBeingEdited?.ruleType ?? ruleCreationMode}
            />

            <VStack width={"100%"} spacing="4px" >
                {Object.entries(rulesList).map(x => {
                    return (
                        <RuleListElement
                            key={x[0]}
                            rule={{ ...x[1], id: x[0] }}
                            onRuleDeleted={updateStateWithFreshRuleList}
                            onEditRequested={onRuleEditRequested} />
                    )
                })}
            </VStack>
        </Container>
    )
}
