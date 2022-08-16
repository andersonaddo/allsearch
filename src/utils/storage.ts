import { defaultHotbar } from "../data/defaultSearchEngines";
import { Hotbar, HotbarEngineType, MacroDefinitionWithId, MacroId, MacroSet, SearchEngineDefinitionWithId, SearchEngineId, SearchEngineSet } from "../data/searchEngineTypes";
import { BackgroundInfo } from "./backgroundProvider";

export const getHotbar = (): Hotbar => {
    const list = localStorage.getItem("hotbar");
    if (!list) return defaultHotbar;
    return JSON.parse(list);
}

export const removeFromHotbar = (id: SearchEngineId | MacroId) => {
    const hotbar = getHotbar();
    delete hotbar[id]
    localStorage.setItem("hotbar", JSON.stringify(hotbar));
}

export const addToHotbar = (id: SearchEngineId | MacroId, entryType: HotbarEngineType) => {
    const hotbar = getHotbar();
    hotbar[id] = entryType;
    localStorage.setItem("hotbar", JSON.stringify(hotbar));
}

export const getCustomSearchEngineList = (): SearchEngineSet => {
    const list = localStorage.getItem("customEngines");
    if (!list) return {};
    return JSON.parse(list);
}

export const addCustomSearchEngine = (engine: SearchEngineDefinitionWithId) => {
    const currentList = getCustomSearchEngineList();
    const { id, ...engineDefWithoutId } = engine;
    currentList[engine.id] = engineDefWithoutId
    localStorage.setItem("customEngines", JSON.stringify(currentList));
}

export const removeCustomSearchEngine = (engine: SearchEngineDefinitionWithId) => {
    const currentList = getCustomSearchEngineList();
    delete currentList[engine.id];
    localStorage.setItem("customEngines", JSON.stringify(currentList));

    //We also have to go through all the macros and edit the ones that have this engine defined
    const currentMacros = Object.entries(getMacros())
    for (const macro of currentMacros) {
        if (Object.keys(macro[1].engines).includes(engine.id)) {
            delete macro[1].engines[engine.id]
            addMacro({ ...macro[1], id: macro[0] })
        }
    }

    //And we must to the same for the hotbar too
    removeFromHotbar(engine.id)
}

export const getMacros = (): MacroSet => {
    const list = localStorage.getItem("engineMacros");
    if (!list) return {};
    return JSON.parse(list);
}

export const addMacro = (macro: MacroDefinitionWithId) => {
    const currentList = getMacros();
    const { id, ...macroDefWithoutId } = macro;
    currentList[macro.id] = macroDefWithoutId
    localStorage.setItem("engineMacros", JSON.stringify(currentList));
}

export const removeMacro = (macro: MacroDefinitionWithId) => {
    const currentList = getMacros();
    delete currentList[macro.id];
    localStorage.setItem("engineMacros", JSON.stringify(currentList));
}

export const getStoredBackgroundInfo = () : BackgroundInfo | null => {
    const info = localStorage.getItem("backgroundInfo");
    if (!info) return null;
    return JSON.parse(info);
}

export const setStoredBackgroundInfo = (info: BackgroundInfo): void => {
    localStorage.setItem("backgroundInfo", JSON.stringify(info));
}