import {
    Button, Checkbox, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Select, Textarea, useToast, Text
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { AnyRule, AutoActivationRuleDefinition, RuleType, StringReplacementRuleDefinition } from "../types/rulesTypes";
import { MacroDefinition, MacroId, SearchEngineDefinition, SearchEngineId } from "../types/searchEngineTypes";
import { addRule, getCustomSearchEngineList, getMacros } from "../utils/storage";
import { EnrichTypeWithId } from "../utils/utils";


interface ModalProps<T> {
    rule?: EnrichTypeWithId<T>,
    mode: RuleType
    onSave: () => void
    isOpen: boolean
    onClose: () => void
}

function inStringRuleMode(p: ModalProps<AnyRule>): p is ModalProps<StringReplacementRuleDefinition> {
    return p.rule?.ruleType === "stringReplacement" || p.mode === "stringReplacement"
}

function inActionRuleMode(p: ModalProps<AnyRule>): p is ModalProps<AutoActivationRuleDefinition> {
    return p.rule?.ruleType === "autoActivation" || p.mode === "autoActivation"
}

const RuleModal: React.FC<ModalProps<AnyRule>> = (props) => {

    //For all rules...
    const [nameInput, setNameInput] = useState('')
    const [triggerListInput, setTriggerListInput] = useState('')
    const [triggerListInvalid, setTriggerListInvalid] = useState(false)
    const checkIfTriggerListInvalid = () => triggerListInput.trim() === ""

    //For String Rules...
    const [replacerInput, setReplacerInput] = useState('')
    const [replacerInvalid, setReplacerInvalid] = useState(false)
    const checkIfReplacerInvalid = () => replacerInput.trim() === ""

    //For Action Rules...
    const [exhaustiveActionList, setExhaustiveActionList] = useState<Record<string, SearchEngineDefinition | MacroDefinition>>({})
    const [selectedAction, setSelectedAction] = useState<MacroId | SearchEngineId>("")
    const [actionSelectionInvalid, setActionSelectionInvalid] = useState(false)
    const checkIfActionSelectionInvalid = () => selectedAction === ""
    const [cleanupTriggerAfterwards, setCleanupTriggerAfterwards] = useState(false)


    const toast = useToast()

    function inEditMode(p: ModalProps<AnyRule>): p is Required<ModalProps<AnyRule>> {
        return p.rule !== undefined;
    }

    function getExhaustiveActionList() {
        let completeList: Record<MacroId | SearchEngineId, SearchEngineDefinition | MacroDefinition> = {}

        const categories = Object.values(defaultSearchEngineCategories)
        for (const category of categories)
            completeList = { ...completeList, ...category.engines }

        const customEngines = getCustomSearchEngineList();
        completeList = { ...completeList, ...customEngines }

        const macros = getMacros();
        completeList = { ...completeList, ...macros }

        setExhaustiveActionList(completeList)
    }

    function getRuleDescription() {
        if (inActionRuleMode(props)) {
            return "Action Rules can activate a specific engine/macro if " +
                "they see a trigger text in your search. The engine/macro doesn't have " +
                "to be in the hotbar to be activated."
        }

        if (inStringRuleMode(props)) {
            return "String Rules can replace trigger texts with a 'replacer text'."
        }
    }


    function attemptSave() {

        if (checkIfTriggerListInvalid()) {
            setTriggerListInvalid(true)
            return
        }

        if (inStringRuleMode(props)) {
            if (checkIfReplacerInvalid()) {
                setReplacerInvalid(true)
                return
            }

            const newRuleWithId: EnrichTypeWithId<StringReplacementRuleDefinition> = {
                id: inEditMode(props) ? props.rule.id : uuidv4(),
                replacer: replacerInput.trim(),
                ruleTypeSchemaVersion: 1,
                triggerStrings: triggerListInput.trim().split("\n").map(x => x.trim()).filter(x => !!x),
                ruleType: "stringReplacement"
            }

            if (nameInput.trim()) newRuleWithId.name = nameInput.trim()
            addRule(newRuleWithId);
        }

        if (inActionRuleMode(props)) {
            if (checkIfActionSelectionInvalid()) {
                setActionSelectionInvalid(true)
                return
            }

            const newRuleWithId: EnrichTypeWithId<AutoActivationRuleDefinition> = {
                id: inEditMode(props) ? props.rule.id : uuidv4(),
                ruleTypeSchemaVersion: 1,
                triggerStrings: triggerListInput.trim().split("\n").map(x => x.trim()).filter(x => !!x),
                ruleType: "autoActivation",
                autoActivatedAction: selectedAction,
                removeTriggerAfterRuleActivation: false
            }

            if (nameInput.trim()) newRuleWithId.name = nameInput.trim()
            addRule(newRuleWithId);
        }

        if (props.onSave) props.onSave()

        toast({
            title: 'Saved!',
            description: inEditMode(props) ? "Your rule is updated" : "You can now activate this rule from the settings.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })

        props.onClose()
    }

    useEffect(() => {
        if (props.isOpen) {
            setNameInput(props.rule?.name ?? "")
            setTriggerListInput(props.rule?.triggerStrings.join("\n") ?? "")

            if (inStringRuleMode(props)) {
                setReplacerInput(props.rule?.replacer ?? "")
            }

            if (inActionRuleMode(props)) {
                getExhaustiveActionList()
                setSelectedAction(props.rule?.autoActivatedAction ?? "")
                setCleanupTriggerAfterwards(props.rule?.removeTriggerAfterRuleActivation ?? false)
            }
        }
    }, [props.rule, props.isOpen, props])


    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="4xl">
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(20deg)'
            />
            <ModalContent>
                <ModalHeader>
                    {inActionRuleMode(props) ? "Action Rule " : "String Rule "}
                    {inEditMode(props) ? "Editor " : "Creator "}
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody>
                    <Text marginBottom={"8px"}>{getRuleDescription()}</Text>
                    <FormControl mb="4">
                        <FormLabel>Rule Name (optional)</FormLabel>
                        <Input
                            onChange={(e) => setNameInput(e.target.value)}
                            value={nameInput}
                        />
                    </FormControl>

                    <FormControl mb="4" isRequired isInvalid={triggerListInvalid}>
                        <FormLabel>Trigger Strings (one per line)</FormLabel>
                        <Textarea
                            overflow={"scroll"}
                            onChange={(e) => setTriggerListInput(e.target.value)}
                            value={triggerListInput}
                        />
                        <FormHelperText>
                            These are the phrases or words that will activate this rule.
                        </FormHelperText>
                        <FormErrorMessage>You need at least one trigger.</FormErrorMessage>
                    </FormControl>


                    {inStringRuleMode(props) &&
                        <FormControl mb="4" isRequired isInvalid={replacerInvalid}>
                            <FormLabel>Replacer</FormLabel>
                            <Input
                                onChange={(e) => setReplacerInput(e.target.value)}
                                value={replacerInput}
                            />
                            <FormHelperText>The text that will replace any occurrence of any of the trigger texts.</FormHelperText>
                            <FormErrorMessage>Invalid replacer</FormErrorMessage>
                        </FormControl>
                    }

                    {inActionRuleMode(props) &&
                        <>
                            <FormControl mb="4" isRequired isInvalid={actionSelectionInvalid}>
                                <FormLabel>Triggered Engine or Macro</FormLabel>
                                <Select
                                    placeholder="Select something!"
                                    value={selectedAction}
                                    onChange={(e) => setSelectedAction(e.target.value)}
                                >
                                    {Object.entries(exhaustiveActionList).map(action => {
                                        return <option value={action[0]}>{action[1].name}</option>
                                    })}
                                </Select>
                                <FormErrorMessage>Be sure to select something from here.</FormErrorMessage>
                            </FormControl>

                            <FormControl mb="4">
                                <Checkbox
                                    onChange={(e) => setCleanupTriggerAfterwards(e.target.checked)}
                                    isChecked={cleanupTriggerAfterwards}>
                                    Remove trigger string afterwards
                                </Checkbox>
                                <FormHelperText>
                                    If this is checked, the trigger text that activated
                                    the engine/macro will be removed from the query.
                                    For example: "This query @g", where @g is a trigger, will become
                                    "This query".
                                </FormHelperText>
                            </FormControl>
                        </>

                    }
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
        </Modal >
    )
}

export default React.memo(RuleModal)

