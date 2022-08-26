import { RuleActivationInfo } from "../types/rulesTypes"
import { getActiveRules, getRules } from "./storage"
import { activateMacro, activateSearchEngine, getMacroFromId, getSearchEngineFromId } from "./utils";

export const generateRuleActivationInfo = (userQuery: string) => {
    const activeRules = getActiveRules();
    const storedRules = getRules();
    let currentUserQuery = userQuery;

    const activationInfo: RuleActivationInfo = {
        finalQuery: "",
        finalActionsToBeActivated: []
    }

    //First thing to do is replace all the necessary strings targeted by string replacement rules
    for (const ruleId of Object.keys(activeRules.stringReplacement)) {
        const rule = storedRules.stringReplacement[ruleId]
        if (!rule) continue;
        for (const trigger of rule.triggerStrings) currentUserQuery = currentUserQuery.replaceAll(trigger, rule.replacer)
    }

    //Then go though all the auto-activation rules
    for (const ruleId of Object.keys(activeRules.autoActivation)) {
        const rule = storedRules.autoActivation[ruleId]
        if (!rule) continue;
        let activated = false;
        for (const trigger of rule.triggerStrings) {
            if (!currentUserQuery.includes(trigger)) continue;
            activated = true
            if (rule.removeTriggerAfterRuleActivation) currentUserQuery = currentUserQuery.replace(trigger, "")
        }
        if (activated) activationInfo.finalActionsToBeActivated.push(rule.autoActivatedAction)
    }

    activationInfo.finalQuery = currentUserQuery
    return activationInfo;
}

export const autoActivateEnginesFromRules = (query: string): void => {
    const activationInfo = generateRuleActivationInfo(query)
    for (const id of activationInfo.finalActionsToBeActivated) {
        const engine = getSearchEngineFromId(id)
        if (engine) {
            activateSearchEngine(activationInfo.finalQuery, engine)
            continue;
        }

        const macro = getMacroFromId(id)
        if (macro) activateMacro(activationInfo.finalQuery, macro)
    }
}

