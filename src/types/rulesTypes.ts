//Rules are given "schema versions" so we can add logic later on for graceful
//handling of converting user rules to new formats if we end up updating how they
//are represented

import { MacroId, SearchEngineId } from "./searchEngineTypes"

export type RuleType = "stringReplacement" | "autoActivation"

export type RuleId = string;

export type AnyRule = StringReplacementRuleDefinition | AutoActivationRuleDefinition

//Note: RuleIds should be universally unique throughout all sections of StoredRules or ActiveRules
export type StoredRules = {
    stringReplacement: Record<RuleId, StringReplacementRuleDefinition>
    autoActivation: Record<RuleId, AutoActivationRuleDefinition>
}

export type ActiveRules = {
    stringReplacement: Record<RuleId, true>
    autoActivation: Record<RuleId, true>
}

export type RuleActivationInfo = {
    finalQuery: string,
    finalActionsToBeActivated: Array<MacroId | SearchEngineId>
}

interface RuleDefinitionBase {
    ruleType: RuleType,
    ruleTypeSchemaVersion: number,
    name?: string
    triggerStrings: string[],
}

export interface StringReplacementRuleDefinition extends RuleDefinitionBase {
    ruleType: "stringReplacement",
    ruleTypeSchemaVersion: 1
    replacer: string,
}

export interface AutoActivationRuleDefinition extends RuleDefinitionBase {
    ruleType: "autoActivation",
    ruleTypeSchemaVersion: 1
    autoActivatedAction: SearchEngineId | MacroId,
    removeTriggerAfterRuleActivation: boolean
}

export const ruleIsStringReplacement = (rule : AnyRule) : rule is StringReplacementRuleDefinition => {
    return rule.ruleType === "stringReplacement"
}

export const ruleIsAutoActivation = (rule : AnyRule) : rule is AutoActivationRuleDefinition => {
    return rule.ruleType === "autoActivation"
}