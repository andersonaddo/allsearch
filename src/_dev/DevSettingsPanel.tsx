import { Button, Checkbox, VStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  ACTIVE_RULES_STORAGE_KEY, BACKGROUND_INFO_STORAGE_KEY,
  clearKey, CUSTOM_ENG_STORAGE_KEY, HOTBAR_STORAGE_KEY,
  MACROS_STORAGE_KEY, ONBOARDING_AGG_INFO_STORAGE_KEY,
  STORED_RULES_STORAGE_KEY, EXTRA_MISC_SETTINGS
} from "../utils/storage";

export const DevSettingsPanel = () => {

  const [chosenKeys, setChosenKeys] = useState<Array<string>>([])

  const onStorageKeyCheckChanged = (isChecked: boolean, value: string): void => {
    if (isChecked) {
      chosenKeys.push(value)
    } else {
      const index = chosenKeys.indexOf(value);
      if (index > -1) chosenKeys.splice(index, 1);
    }
    setChosenKeys([...chosenKeys])
  }

  const resetStorage = () => {
    chosenKeys.forEach(k => clearKey(k))
  }

  return (
    <VStack alignContent={"center"} justifyContent={"center"} minWidth={"80%"} direction="column">

      <Checkbox
        value={HOTBAR_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, HOTBAR_STORAGE_KEY)}>
        HOTBAR_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={CUSTOM_ENG_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, CUSTOM_ENG_STORAGE_KEY)}>
        CUSTOM_ENG_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={MACROS_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, MACROS_STORAGE_KEY)}>
        MACROS_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={BACKGROUND_INFO_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, BACKGROUND_INFO_STORAGE_KEY)}>
        BACKGROUND_INFO_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={ONBOARDING_AGG_INFO_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, ONBOARDING_AGG_INFO_STORAGE_KEY)}>
        ONBOARDING_AGG_INFO_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={STORED_RULES_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, STORED_RULES_STORAGE_KEY)}>
        STORED_RULES_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={ACTIVE_RULES_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, ACTIVE_RULES_STORAGE_KEY)}>
        ACTIVE_RULES_STORAGE_KEY
      </Checkbox>

      <Checkbox
        value={ACTIVE_RULES_STORAGE_KEY}
        onChange={e => onStorageKeyCheckChanged(e.target.checked, EXTRA_MISC_SETTINGS)}>
        EXTRA_MISC_SETTINGS
      </Checkbox>

      <Button onClick={resetStorage} colorScheme="red">Reset local storage</Button>

    </VStack>
  );
}