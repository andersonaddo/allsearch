import { ActiveRules, AnyRule, RuleId, ruleIsAutoActivation, ruleIsStringReplacement, RuleType, StoredRules } from "../types/rulesTypes";
import { Hotbar, HotbarEngineType, MacroDefinitionWithId, MacroId, MacroSet, SearchEngineDefinitionWithId, SearchEngineId, SearchEngineSet } from "../types/searchEngineTypes";
import { defaultActiveRules, defaultCustomEngineList, defaultHotbar, defaultMacroList, defaultRules, defaultSessionAggregationInfo } from "../data/storageDefaults";
import { BackgroundInfo } from "./backgroundProvider";
import { SessionAggregationInfo } from "./onboardingManager";
import { EnrichTypeWithId } from "./utils";

export const HOTBAR_STORAGE_KEY = "hotbar"
export const CUSTOM_ENG_STORAGE_KEY = "customEngines"
export const MACROS_STORAGE_KEY = "engineMacros"
export const BACKGROUND_INFO_STORAGE_KEY = "backgroundInfo"
export const ONBOARDING_AGG_INFO_STORAGE_KEY = "onboardingSessionAggInfo"
export const STORED_RULES_STORAGE_KEY = "storedRules"
export const ACTIVE_RULES_STORAGE_KEY = "activeRules"

export const clearKey = (key : string) => {
    localStorage.removeItem(key)
}

export const forceSetKey = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val))
}

export const getHotbar = (): Hotbar => {
    const list = localStorage.getItem(HOTBAR_STORAGE_KEY);
    if (!list) return defaultHotbar;
    return JSON.parse(list);
}

export const removeFromHotbar = (id: SearchEngineId | MacroId) => {
    const hotbar = getHotbar();
    delete hotbar[id]
    localStorage.setItem(HOTBAR_STORAGE_KEY, JSON.stringify(hotbar));
}

export const addToHotbar = (id: SearchEngineId | MacroId, entryType: HotbarEngineType) => {
    const hotbar = getHotbar();
    hotbar[id] = entryType;
    localStorage.setItem(HOTBAR_STORAGE_KEY, JSON.stringify(hotbar));
}

export const getCustomSearchEngineList = (): SearchEngineSet => {
    const list = localStorage.getItem(CUSTOM_ENG_STORAGE_KEY);
    if (!list) return defaultCustomEngineList
    return JSON.parse(list);
}

export const addCustomSearchEngine = (engine: SearchEngineDefinitionWithId) => {
    const currentList = getCustomSearchEngineList();
    const { id, ...engineDefWithoutId } = engine;
    currentList[engine.id] = engineDefWithoutId
    localStorage.setItem(CUSTOM_ENG_STORAGE_KEY, JSON.stringify(currentList));
}

export const removeCustomSearchEngine = (engine: SearchEngineDefinitionWithId) => {
    const currentList = getCustomSearchEngineList();
    delete currentList[engine.id];
    localStorage.setItem(CUSTOM_ENG_STORAGE_KEY, JSON.stringify(currentList));

    //We also have to go through all the macros and edit the ones that have this engine defined
    const currentMacros = Object.entries(getMacros())
    for (const macro of currentMacros) {
        if (Object.keys(macro[1].engines).includes(engine.id)) {
            delete macro[1].engines[engine.id]
            addMacro({ ...macro[1], id: macro[0] })
        }
    }

    //Do the same for the relevant rules...
    const currentRules = Object.entries(getRules().autoActivation)
    for (const rule of currentRules) {
        if (rule[1].autoActivatedAction === engine.id) {
            removeRule({ ...rule[1], id: rule[0] })
        }
    }

    //And we must to the same for the hotbar too
    removeFromHotbar(engine.id)
}

export const getMacros = (): MacroSet => {
    const list = localStorage.getItem(MACROS_STORAGE_KEY);
    if (!list) return defaultMacroList;
    return JSON.parse(list);
}

export const addMacro = (macro: MacroDefinitionWithId) => {
    const currentList = getMacros();
    const { id, ...macroDefWithoutId } = macro;
    currentList[macro.id] = macroDefWithoutId
    localStorage.setItem(MACROS_STORAGE_KEY, JSON.stringify(currentList));
}

export const removeMacro = (macro: MacroDefinitionWithId) => {
    const currentList = getMacros();
    delete currentList[macro.id];
    
    removeFromHotbar(macro.id)

    //Delete the rules that make use of this macro...
    const currentRules = Object.entries(getRules().autoActivation)
    for (const rule of currentRules) {
        if (rule[1].autoActivatedAction === macro.id) {
            removeRule({ ...rule[1], id: rule[0] })
        }
    }

    localStorage.setItem(MACROS_STORAGE_KEY, JSON.stringify(currentList));
}

export const getStoredBackgroundInfo = (): BackgroundInfo | null => {
    const info = localStorage.getItem(BACKGROUND_INFO_STORAGE_KEY);
    if (!info) return null;
    return JSON.parse(info);
}

export const setStoredBackgroundInfo = (info: BackgroundInfo): void => {
    localStorage.setItem(BACKGROUND_INFO_STORAGE_KEY, JSON.stringify(info));
}

export const getSessionAggregationInfo = (): SessionAggregationInfo => {
    const info = localStorage.getItem(ONBOARDING_AGG_INFO_STORAGE_KEY);
    if (!info) return defaultSessionAggregationInfo;
    return JSON.parse(info);
}

export const setSessionAggregationInfo = (info: SessionAggregationInfo): void => {
    localStorage.setItem(ONBOARDING_AGG_INFO_STORAGE_KEY, JSON.stringify(info));
}

export const getRules = (): StoredRules => {
    const list = localStorage.getItem(STORED_RULES_STORAGE_KEY);
    if (!list) return defaultRules;
    return JSON.parse(list);
}

export const addRule = (rule: EnrichTypeWithId<AnyRule>) => {
    const currentList = getRules();
    const { id, ...ruleDefWithoutId } = rule;

    if (ruleIsAutoActivation(ruleDefWithoutId)) currentList.autoActivation[id] = ruleDefWithoutId
    if (ruleIsStringReplacement(ruleDefWithoutId)) currentList.stringReplacement[id] = ruleDefWithoutId

    localStorage.setItem(STORED_RULES_STORAGE_KEY, JSON.stringify(currentList));
}

export const removeRule = (rule: EnrichTypeWithId<AnyRule>) => {
    const currentList = getRules();

    //Meh I'm lazy, just remove the ID from everything
    delete currentList.autoActivation[rule.id];
    delete currentList.stringReplacement[rule.id];

    removeFromActiveRules(rule.id)
    localStorage.setItem(STORED_RULES_STORAGE_KEY, JSON.stringify(currentList));
}

export const getActiveRules = (): ActiveRules => {
    const list = localStorage.getItem(ACTIVE_RULES_STORAGE_KEY);
    if (!list) return defaultActiveRules;
    return JSON.parse(list);
}

export const removeFromActiveRules = (id: RuleId) => {
    const activeRules = getActiveRules();

    //Meh I'm lazy, just remove the ID from everything
    delete activeRules.autoActivation[id];
    delete activeRules.stringReplacement[id];

    localStorage.setItem(ACTIVE_RULES_STORAGE_KEY, JSON.stringify(activeRules));
}

export const addToActiveRules = (id: RuleId, ruleType: RuleType) => {
    const activeRules = getActiveRules();

    if (ruleType === "autoActivation") activeRules.autoActivation[id] = true;
    if (ruleType === "stringReplacement") activeRules.stringReplacement[id] = true;

    localStorage.setItem(ACTIVE_RULES_STORAGE_KEY, JSON.stringify(activeRules));
}

