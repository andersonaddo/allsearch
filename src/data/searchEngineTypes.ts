export type EngineShortcut = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k'
    | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
    | 'y' | 'z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type QueryType = `${string | ''}{searchTerms}${string | ''}`

export type SearchEngineId = string;
export type MacroId = string;
export type SearchEngineCategoryId = string;

export interface SearchEngineDefinition {
    name: string;
    shortcut: EngineShortcut;
    query: QueryType
    description?: string
    logoUrl?: string
    parent?: SearchEngineId //currently unused
}

export interface SearchEngineDefinitionWithId extends SearchEngineDefinition {
    id: SearchEngineId
}

export type SearchEngineCategoryDefinition = {
    title: string,
    description: string,
    engines: SearchEngineSet,
    isCustomCategory?: boolean;
}

export interface SearchEngineCategoryDefinitionWithId extends SearchEngineCategoryDefinition {
    id: SearchEngineCategoryId
}

export type SearchEngineSet = Record<SearchEngineId, SearchEngineDefinition>

export type HotbarEngineType = "engine" | "macro"
export type Hotbar = Record<SearchEngineId | MacroId, HotbarEngineType>

export type MacroSet = Record<MacroId, MacroDefinition>

export type MacroDefinition = {
    name: string;
    shortcut: EngineShortcut;
    logoUrl?: string;
    description?: string;
    engines: Record<SearchEngineId, true>
}

export interface MacroDefinitionWithId extends MacroDefinition {
    id: MacroId
}