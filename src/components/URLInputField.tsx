import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputProps } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { isUrl } from "../utils/utils";

interface URLInputFieldProps extends InputProps {
    onValidityChange: (isValid: boolean) => void,
    onValueChange: (value: string) => void,

    label: string,
    helperText: string,
    initialValue: string,
    isRequired: boolean,
    isDisabled?: boolean
}

//TODO: still not super satisfied how this handles initial value. See how it twitches in the settings panel
const URLInputField: React.FC<URLInputFieldProps> = (props) => {

    const {
        onValidityChange, label, helperText, initialValue,
        isRequired, onValueChange, isDisabled, ...otherProps
    } = props

    const [urlInput, setUrlInput] = useState(initialValue)
    const [urlInputValid, setUrlInputValid] = useState(false)
    const checkIfUrlValid = () => {
        if (isRequired && urlInput.trim() === "") return false
        return urlInput.trim() !== "" && isUrl(urlInput.trim())
    }


    useEffect(() => {
        const isValid = checkIfUrlValid()
        onValidityChange(isValid)
        setUrlInputValid(isValid)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled])

    return (
        <FormControl
            mb="4" isInvalid={!urlInputValid && !isDisabled}
            isRequired={isRequired} isDisabled={isDisabled}
        >
            <FormLabel>{label}</FormLabel>
            <Input
                onChange={(e) => {
                    setUrlInput(e.target.value)
                    onValueChange(e.target.value)
                }}
                value={urlInput}
                onBlur={() => {
                    const isValid = checkIfUrlValid()
                    onValidityChange(isValid)
                    setUrlInputValid(isValid)
                }}
                {...otherProps}
            />
            <FormHelperText>{helperText}</FormHelperText>
            <FormErrorMessage>This isn't a valid URL!</FormErrorMessage>
        </FormControl>
    )
}

export default React.memo(URLInputField)
