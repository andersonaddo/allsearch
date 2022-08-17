import { Center, Text, useBoolean } from "@chakra-ui/react";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { MacroDefinition, SearchEngineDefinition } from "../data/searchEngineTypes";
import { activateMacro, activateSearchEngines as activateSearchEngine } from "../utils/utils";
import { EngineOrMacroLogo } from "./EngineOrMacroLogo";

interface BaseChipProps {
    actionItem: SearchEngineDefinition | MacroDefinition,
    lastTypedUnfocusedKey: string;
    onActivatedByShortcut: () => void
    activationFunc: () => void
    isMacro?: boolean
}

const HotbarChipBase: React.FC<BaseChipProps> = (props) => {
    const [isHovered, hoverFlag] = useBoolean(false)

    const formatName = useCallback(() => {
        const { name, shortcut } = props.actionItem
        const indexOfShortcut = name.toLowerCase().indexOf(shortcut)
        if (indexOfShortcut === -1) {
            return <Text>{name} ({shortcut})</Text>
        } else {
            const firstHalf = name.substring(0, indexOfShortcut)
            const token = name.substring(indexOfShortcut, indexOfShortcut + 1)
            const secondHalf = name.substring(indexOfShortcut + 1, name.length)

            return <Text>{firstHalf}<u>{token}</u>{secondHalf}</Text>
        }
    }, [props.actionItem])


    useEffect(() => {
        if (props.lastTypedUnfocusedKey === props.actionItem.shortcut) {
            props.activationFunc()
            props.onActivatedByShortcut()
        }
    }, [props])

    return (
        <Center
            border='2px'
            borderColor='gray.200'
            height="fit-content"
            borderRadius="2xl"
            padding="8px"
            onMouseEnter={hoverFlag.on}
            onMouseLeave={hoverFlag.off}
            backgroundColor={isHovered ? "grey" : undefined}
            onClick={props.activationFunc}
            backdropFilter="blur(3px)"
        >
            <EngineOrMacroLogo
                size={35}
                info={props.actionItem}
                marginRight={"8px"}
                isMacro={props.isMacro}
            />
            {formatName()}
        </Center>
    )
}



interface EngineChipProps {
    actionItem: SearchEngineDefinition
    userSearchQuery: string
    lastTypedUnfocusedKey: string;
    onActivatedByShortcut: () => void
}

//Would have liked to wrap these in a memo, but then the clicking functionality 
//wouldn't work to well because that relies on them always having the most up-to-date query
export const SearchEngineChip: React.FC<EngineChipProps> = (props) => {
    return (
        <HotbarChipBase
            activationFunc={() => activateSearchEngine(props.userSearchQuery, props.actionItem)}
            actionItem={props.actionItem}
            lastTypedUnfocusedKey={props.lastTypedUnfocusedKey}
            isMacro={false}
            onActivatedByShortcut={props.onActivatedByShortcut}
        />
    )
}

interface MacroChipProps {
    actionItem: MacroDefinition
    userSearchQuery: string
    lastTypedUnfocusedKey: string;
    onActivatedByShortcut: () => void
}

export const MacroChip: React.FC<MacroChipProps> = (props) => {
    return (
        <HotbarChipBase
            activationFunc={() => activateMacro(props.userSearchQuery, props.actionItem)}
            actionItem={props.actionItem}
            lastTypedUnfocusedKey={props.lastTypedUnfocusedKey}
            isMacro={true}
            onActivatedByShortcut={props.onActivatedByShortcut}
        />
    )
}