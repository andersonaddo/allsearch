import { DeepPartial } from "../utils/utils"
import { ActiveRules, StoredRules } from "./rulesTypes"
import { Hotbar, MacroSet, SearchEngineSet } from "./searchEngineTypes"

export type ConfigExport = {
    hotbar: Hotbar,
    customSearchEngines: SearchEngineSet,
    macros: MacroSet,
    storedRules: StoredRules,
    activeRules: ActiveRules
}

export type ConfigImport = DeepPartial<ConfigExport>