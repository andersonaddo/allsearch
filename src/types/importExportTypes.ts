import { DeepPartial } from "../utils/utils"
import { MiscSettingsConfig } from "./miscSettingsConfig"
import { ActiveRules, StoredRules } from "./rulesTypes"
import { Hotbar, MacroSet, SearchEngineSet } from "./searchEngineTypes"

export type ConfigExport = {
    hotbar: Hotbar,
    customSearchEngines: SearchEngineSet,
    macros: MacroSet,
    storedRules: StoredRules,
    activeRules: ActiveRules,
    miscSettings: MiscSettingsConfig
}

export type NonFatalImportErrors = {
    nonExistentEnginesInHotbar: number,
    nonExistentMacrosInHotbar: number
}

export type ConfigImport = DeepPartial<ConfigExport>