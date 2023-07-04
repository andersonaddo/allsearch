import { ActiveRules, StoredRules } from "../types/rulesTypes";
import { Hotbar, MacroSet, SearchEngineSet } from "../types/searchEngineTypes";
import { currentVersionForOnboarding, SessionAggregationInfo } from "../utils/onboardingManager";
import {MiscSettingsConfig} from '../types/miscSettingsConfig'

export const defaultHotbar: Hotbar = {
    google: "engine",
    yahoo: "engine",
    exampleMacro: "macro",
}

export const defaultCustomEngineList : SearchEngineSet = {}

export const defaultMacroList : MacroSet = {
    exampleMacro:{
        name: "Example Macro",
        shortcut: "m",
        description: "A sample macro. Feel free to delete it.",
        engines: {brave: true, ddg: true}
    }
}

export const defaultRules: StoredRules = {
    stringReplacement: {
        redditRule: {
            name: "Example String Rule: Reddit",
            ruleType: "stringReplacement",
            ruleTypeSchemaVersion: 1,
            triggerStrings: ["/r"],
            replacer: "site:reddit.com",
        }
    },
    autoActivation: {
        googleRule: {
            name: "Example Action Rule: Google",
            ruleType: "autoActivation",
            ruleTypeSchemaVersion: 1,
            triggerStrings: ["/g"],
            removeTriggerAfterRuleActivation: true,
            autoActivatedAction: "google"
        }
    }
};

export const defaultActiveRules: ActiveRules = {
    stringReplacement: {redditRule: true},
    autoActivation: {googleRule: true}
};

export const defaultSessionAggregationInfo: SessionAggregationInfo = {
    currentVersion: currentVersionForOnboarding,
    versionInLastSession: currentVersionForOnboarding,
    totalLaunches: 0,
    launchesThisVersion: 0,
    infoButtonAllsearchIntroductionShown: false,
    newVersionModalShown: false
}

export const defaultMiscSettings : MiscSettingsConfig = {
    readFromClipboardForQuery: true,
    userDefinedBackgroundEnabled: false
}