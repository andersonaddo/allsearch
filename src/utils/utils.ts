import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { MacroDefinition, SearchEngineDefinition } from "../types/searchEngineTypes";
import { getCustomSearchEngineList, getMacros } from "./storage";

//https://stackoverflow.com/a/49725198
//https://stackoverflow.com/a/52417260
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]


export type EnrichTypeWithId<T> = T & { id: string }

//https://stackoverflow.com/a/61132308
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

//https://create-react-app.dev/docs/adding-custom-environment-variables/
export const isInDevMode = (): boolean => {
    return process.env.NODE_ENV === 'development';
}

export const getSearchEngineFromId = (id: string): SearchEngineDefinition | undefined => {
    //First check the default engines
    const categories = Object.values(defaultSearchEngineCategories)
    for (const category of categories) {
        if (category.engines[id]) return category.engines[id]
    }

    //Check custom engines
    const customEngines = getCustomSearchEngineList();
    for (const engineId in customEngines) {
        if (engineId === id) return customEngines[engineId]
    }

    return;
}

export const getMacroFromId = (id: string): MacroDefinition | undefined => {
    const macros = getMacros();
    for (const macroId in macros) {
        if (macroId === id) return macros[id]
    }
    return;
}

//https://stackoverflow.com/a/1701911
export const isUrl = (s: string): boolean => {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
    return regexp.test(s);
}


export const isValidShortcut = (s: string): boolean => {
    return !!s.match(/^[0-9a-z]+$/)
}


export const activateSearchEngine = (query: string, engine: SearchEngineDefinition) => {
    if (query.trim() === "") return;
    const completedQuery = engine.query.replace("{searchTerms}", encodeURIComponent(query))
    window.open(completedQuery, '_blank');
}

export const activateMacro = (query: string, macro: MacroDefinition) => {
    for (const engineId in macro.engines) {
        const engine = getSearchEngineFromId(engineId);
        if (!engine) continue;
        activateSearchEngine(query, engine)
    }
}

export function getRandomInt(maxExclusive: number | undefined) {
    return Math.floor(Math.random() * (maxExclusive ?? 0));
}