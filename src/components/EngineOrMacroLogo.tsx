import { Image, ImageProps } from "@chakra-ui/react";
import * as React from "react";
import { SearchEngineDefinition, MacroDefinition } from "../data/searchEngineTypes";
import { RequireAtLeastOne } from "../utils/utils";

type EngineOrMacroIconPropsFull = {
    info?: SearchEngineDefinition | MacroDefinition
    url?: string
    size: number
    isMacro?: boolean
}

type IconProps = RequireAtLeastOne<EngineOrMacroIconPropsFull, "info" | "url">

export const EngineOrMacroLogo: React.FC<IconProps & ImageProps> = (props) => {

    const {info, size, isMacro, ...otherProps} = props;
    return (
        <Image
            borderRadius='full'
            fit = "contain"
            boxSize={`${size}px`}
            src={info?.logoUrl || props.url}
            alt={`${info?.name ?? (isMacro ? "Macro" : "Engine")} logo`}
            fallbackSrc={isMacro ? require("../media/MacroDefault.png") : require("../media/EngineDefault.png")}
            {...otherProps}
        />
    )
}
