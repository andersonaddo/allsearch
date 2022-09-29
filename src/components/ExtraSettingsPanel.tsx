import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Checkbox, Code, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { ConfigExport, ConfigImport, NonFatalImportErrors } from "../types/importExportTypes";
import { AutoActivationRuleDefinition, RuleId, StringReplacementRuleDefinition } from "../types/rulesTypes";
import { Hotbar, MacroSet, SearchEngineId, SearchEngineSet } from "../types/searchEngineTypes";
import {
  ACTIVE_RULES_STORAGE_KEY, clearKey, CUSTOM_ENG_STORAGE_KEY,
  EXTRA_MISC_SETTINGS,
  forceSetKey, getActiveRules, getCustomSearchEngineList,
  getHotbar, getMacros, getMiscSettingsConfig, getRules, HOTBAR_STORAGE_KEY, MACROS_STORAGE_KEY,
  ONBOARDING_AGG_INFO_STORAGE_KEY,
  setMiscSettingsConfig,
  STORED_RULES_STORAGE_KEY
} from "../utils/storage";
import { isInDevMode } from "../utils/utils";
import GenericInfo from "./GenericInfo";
import GenericWarning from "./GenericWarning";
import Spacer from "./Spacer";

export const ExtraSettingsPanel = () => {

  const [invalidFileInput, setInvalidFileInput] = useState(false)
  const [importErrorMessage, setImportErrorMessage] = useState("")
  const [nonFatalImportErrors, setNonFatalImportErrors] = useState("")
  const [clipboardCheckboxChecked, setClipboardCheckboxChecked] = useState(false)

  const { isOpen: isImportModalOpen, onOpen: setImportModalOpen, onClose: setImportModalClose } = useDisclosure()
  const { isOpen: isNonFatalModalOpen, onOpen: setNonFatalModalOpen, onClose: setNonFatalModalClose } = useDisclosure()
  const { isOpen: isInfoModalOpen, onOpen: setInfoModalOpen, onClose: setInfoModalClose } = useDisclosure()
  const { isOpen: isResetModalOpen, onOpen: setResetModalOpen, onClose: setResetModalClose } = useDisclosure()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const toast = useToast()

  useEffect(() => {
    setClipboardCheckboxChecked(getMiscSettingsConfig().readFromClipboardForQuery)
  }, [])

  function exportConfiguration() {
    const data: ConfigExport = {
      hotbar: getHotbar(),
      customSearchEngines: getCustomSearchEngineList(),
      macros: getMacros(),
      storedRules: getRules(),
      activeRules: getActiveRules()
    }

    //https://stackoverflow.com/a/30800715
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "allsearchExport.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  //TODO: currently this checks for type matches (so like, strings should be strings)
  //But doesn't check for things like queries having {searchTerms} in them
  async function importConfiguration() {
    //We're dealing with arbitrary files, so this can be super error prone
    try {
      const file = fileInputRef.current?.files?.item(0)
      setInvalidFileInput(!file)
      if (!file) return;
      const result = (await readFile(file)).target?.result
      if (typeof result != "string") throw new Error("Bad File!")
      const importObj: ConfigImport = JSON.parse(result)

      //*******First let's get local versions of everything that will be affected*******
      const localHotbar = getHotbar();
      const localCustomEngines = getCustomSearchEngineList();
      const localMacros = getMacros();
      const localStoredRules = getRules();
      const localActiveRules = getActiveRules();

      //For the errors I bother to handle gracefully
      //Some of these errors should no longer be possible in the current version of 
      //Allsearch (as long as they don't tamper with the export file), but some users
      //have started using Allsearch since older versions and hence their local storage
      //state isn't always the cleanest
      const nonFatalImportErrors: NonFatalImportErrors = {
        nonExistentEnginesInHotbar: 0,
        nonExistentMacrosInHotbar: 0
      }

      //*******Start with the custom engines*******
      for (const engine of Object.entries(importObj.customSearchEngines as SearchEngineSet)) {
        if (typeof engine[1]?.name != "string" ||
          typeof engine[1]?.shortcut != "string" ||
          typeof engine[1]?.query != "string" ||
          (typeof engine[1]?.description != "string" && typeof engine[1]?.description != "undefined") ||
          (typeof engine[1]?.logoUrl != "string" && typeof engine[1]?.logoUrl != "undefined") ||
          (typeof engine[1]?.parent != "string" && typeof engine[1]?.parent != "undefined")) {
          throw new Error("Bad Custom Engine: Type mismatch!")
        }

        //This is a pattern we'll use a lot. We have no idea what other random 
        //fields will be in this file, so we'll just take what we need and leave the rest
        localCustomEngines[engine[0]] = {
          name: engine[1]?.name,
          shortcut: engine[1]?.shortcut,
          query: engine[1]?.query,
          description: engine[1]?.description,
          logoUrl: engine[1]?.logoUrl,
          parent: engine[1]?.parent,
        }
      }

      //*******Going on to the macros!*******
      for (const macro of Object.entries(importObj.macros as MacroSet)) {
        if (typeof macro[1]?.name != "string" ||
          typeof macro[1]?.shortcut != "string" ||
          typeof macro[1]?.engines != "object" ||
          (typeof macro[1]?.description != "string" && typeof macro[1]?.description != "undefined") ||
          (typeof macro[1]?.logoUrl != "string" && typeof macro[1]?.logoUrl != "undefined")) {
          throw new Error("Bad Macro: Type mismatch!")
        }

        //TODO: didn't bother to check if the entries in the macro engine list are actual engines
        for (const val of Object.values(macro[1]?.engines)) {
          if (val !== true) throw new Error("Bad Macro: Value of Engine List mismatch!")
        }

        localMacros[macro[0]] = {
          name: macro[1]?.name,
          shortcut: macro[1]?.shortcut,
          description: macro[1]?.description,
          logoUrl: macro[1]?.logoUrl,
          engines: macro[1]?.engines as Record<SearchEngineId, true>
        }
      }

      //*******Now things are safe enough for adding things to the hotbar*******
      for (const idEntry of Object.entries(importObj.hotbar as Hotbar)) {
        if (typeof idEntry[1] != "string") throw new Error("Bad Hotbar: Value not a string!")

        //For every entry in the hotbar, make sure it's actually in the engine or macro list
        if (idEntry[1] === "engine") {
          let isPresent = false
          Object.values(defaultSearchEngineCategories).forEach(category => {
            if (Object.keys(category.engines).includes(idEntry[0])) isPresent = true;
          });

          if (Object.keys(localCustomEngines).includes(idEntry[0])) isPresent = true;
          if (!isPresent) {
            nonFatalImportErrors.nonExistentEnginesInHotbar++;
          } else {
            localHotbar[idEntry[0]] = "engine";
          }
        } else {
          let isPresent = false
          if (Object.keys(localMacros).includes(idEntry[0])) isPresent = true;
          if (!isPresent) {
            nonFatalImportErrors.nonExistentMacrosInHotbar++;
          } else {
            localHotbar[idEntry[0]] = "macro";
          }
        }
      }

      //*******Off to the rules!*******
      for (const rule of Object.entries(importObj.storedRules?.stringReplacement as Record<RuleId, StringReplacementRuleDefinition>)) {

        if (rule[1]?.ruleType !== "stringReplacement" ||
          typeof rule[1]?.ruleTypeSchemaVersion != "number" ||
          (typeof rule[1]?.name != "string" && typeof rule[1]?.name != "undefined") ||
          typeof rule[1]?.triggerStrings != "object" ||
          typeof rule[1]?.replacer != "string") {
          throw new Error("Bad String Rule: Type mismatch!")
        }

        //TODO: make sure trigger strings field is in correct form

        localStoredRules.stringReplacement[rule[0]] = {
          ruleType: rule[1]?.ruleType,
          triggerStrings: rule[1]?.triggerStrings,
          replacer: rule[1]?.replacer,
          name: rule[1]?.name,
          ruleTypeSchemaVersion: rule[1]?.ruleTypeSchemaVersion
        }
      }

      for (const rule of Object.entries(importObj.storedRules?.autoActivation as Record<RuleId, AutoActivationRuleDefinition>)) {

        if (rule[1]?.ruleType !== "autoActivation" ||
          typeof rule[1]?.ruleTypeSchemaVersion != "number" ||
          (typeof rule[1]?.name != "string" && typeof rule[1]?.name != "undefined") ||
          typeof rule[1]?.triggerStrings != "object" ||
          typeof rule[1]?.removeTriggerAfterRuleActivation != "boolean" ||
          typeof rule[1]?.autoActivatedAction != "string") {
          throw new Error("Bad Action Rule: Type mismatch!")
        }

        //Meh, don't bother checking if the autoActivatedAction is actually in the 
        //overall list of macros or engines; I'm lazy atm
        //TODO: come back to this later

        localStoredRules.autoActivation[rule[0]] = {
          ruleType: rule[1]?.ruleType,
          triggerStrings: rule[1]?.triggerStrings,
          removeTriggerAfterRuleActivation: rule[1]?.removeTriggerAfterRuleActivation,
          name: rule[1]?.name,
          ruleTypeSchemaVersion: rule[1]?.ruleTypeSchemaVersion,
          autoActivatedAction: rule[1]?.autoActivatedAction
        }
      }

      //*******Finally, active rules...*******
      for (const rule of Object.entries(importObj.activeRules?.stringReplacement as Record<RuleId, true>)) {
        if (rule[1] !== true || !localStoredRules.stringReplacement[rule[0]])
          throw new Error("Bad Active String Rule: Value mismatch or rule not in rule list!")

        localActiveRules.stringReplacement[rule[0]] = true
      }

      for (const rule of Object.entries(importObj.activeRules?.autoActivation as Record<RuleId, true>)) {
        if (rule[1] !== true || !localStoredRules.autoActivation[rule[0]])
          throw new Error("Bad Active Action Rule: Value mismatch or rule not in rule list!")

        localActiveRules.autoActivation[rule[0]] = true
      }

      //Now we can just import everything now
      forceSetKey(HOTBAR_STORAGE_KEY, localHotbar)
      forceSetKey(MACROS_STORAGE_KEY, localMacros)
      forceSetKey(CUSTOM_ENG_STORAGE_KEY, localCustomEngines)
      forceSetKey(STORED_RULES_STORAGE_KEY, localStoredRules)
      forceSetKey(ACTIVE_RULES_STORAGE_KEY, localActiveRules)

      toast({
        title: 'Success!',
        description: "Import complete.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      if (nonFatalImportErrors.nonExistentEnginesInHotbar !== 0 ||
        nonFatalImportErrors.nonExistentMacrosInHotbar !== 0) {
        setNonFatalImportErrors(generateNonFatalErrorImportReport(nonFatalImportErrors))
        setNonFatalModalOpen()
      }

    } catch (err: any) {
      if (isInDevMode()) console.error(err)
      setImportErrorMessage(err?.message)
      setInfoModalOpen()
    }
  }

  function resetAllsearch() {

    clearKey(HOTBAR_STORAGE_KEY)
    clearKey(MACROS_STORAGE_KEY)
    clearKey(CUSTOM_ENG_STORAGE_KEY)
    clearKey(STORED_RULES_STORAGE_KEY)
    clearKey(ACTIVE_RULES_STORAGE_KEY)
    clearKey(ONBOARDING_AGG_INFO_STORAGE_KEY)
    clearKey(EXTRA_MISC_SETTINGS)

    toast({
      title: 'Reset!',
      description: "Allsearch has been reset",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    //For some reason just passing in window.location.reload wasn't good enough
    setTimeout(() => window.location.reload(), 1000)
  }

  function readFile(file: File): Promise<ProgressEvent<FileReader>> {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = resolve
      reader.onerror = reject;
    });
  }

  function generateNonFatalErrorImportReport(errors: NonFatalImportErrors): string {
    let message = "";

    if (errors.nonExistentEnginesInHotbar)
      message += `There were ${errors.nonExistentEnginesInHotbar} engines in the imported hotbar that actually didn't exist, so we removed them.`
    if (errors.nonExistentMacrosInHotbar)
      message += `There were ${errors.nonExistentMacrosInHotbar} macros in the imported hotbar that actually didn't exist, so we removed them.`

    return message
  }

  return (
    <Container alignContent={"center"} justifyContent={"center"} minWidth={"80%"}>

      <Heading>Extra Functionality</Heading>

      <Checkbox
        isChecked={clipboardCheckboxChecked}
        onChange={(e) => {
          setMiscSettingsConfig({ ...getMiscSettingsConfig(), readFromClipboardForQuery: e.target.checked })
          setClipboardCheckboxChecked(!clipboardCheckboxChecked)
        }}
        mb="8"
      >
        Pressing the <Code>`</Code> key fills the search bar with the contents of the clipboard. Doesn't work for Firefox.
      </Checkbox>

      <Heading>Import/Export</Heading>

      <Text m="2">
        Export your Allsearch configuration to a plain text file to allow others to import it.
      </Text>
      <Button onClick={exportConfiguration}>Export Allsearch Configuration</Button>

      <Spacer axis="vertical" size={"40px"} />

      <Text m="2">
        Import an Allsearch configuration.
        This does not delete any of your additions to Allsearch, but adds the import's.
      </Text>

      <FormControl isRequired isInvalid={invalidFileInput} mb="4">
        <FormLabel>Allsearch config file (ends in .json)</FormLabel>
        <Input
          paddingTop={"4px"} //for some reason browsers aren't centering it properly...
          type="file"
          accept="application/JSON"
          ref={fileInputRef}
        />
        <FormErrorMessage>You haven't chosen a file yet!</FormErrorMessage>
      </FormControl>

      <Button onClick={setImportModalOpen}>Import Allsearch Configuration</Button>

      <Spacer axis="vertical" size={"40px"} />

      <Heading>Resetting</Heading>

      <Text m="2" color={"red"}>
        Reset Allsearch
      </Text>
      <Button onClick={setResetModalOpen} colorScheme="red">Reset Allsearch</Button>


      <GenericWarning
        message="Are you sure you want to import? If it adds things you don't want, they'll have to be removed manually by you."
        onClose={setImportModalClose}
        isOpen={isImportModalOpen}
        onConfirm={importConfiguration}
      />

      <GenericWarning
        message={
          "Are you sure you want to reset Allsearch? " +
          "This will delete all your macros, engines and rules, and will reset Allsearch to its defaults" +
          "\n\n We recommend exporting your Allsearch config as a backup just in case you change your mind."
        }
        onClose={setResetModalClose}
        isOpen={isResetModalOpen}
        onConfirm={resetAllsearch}
      />

      <GenericInfo
        message={
          "Looks like something went wrong with the import; " +
          "something is probably wrong with the file. Ask the owner to re-export." +
          "\n\n" + importErrorMessage
        }
        onClose={setInfoModalClose}
        isOpen={isInfoModalOpen}
      />

      <GenericInfo
        onClose={setNonFatalModalClose}
        isOpen={isNonFatalModalOpen}
      >
        <>
          <Text pb={4}>
            The import was successful, but we might not have imported everything from
            that import file. There were some minor issues with the config file you used.
            This won't cause any issues with your Allsearch though!
          </Text>
          <Accordion>
            <AccordionItem>
              <AccordionButton>
                What exactly wen't wrong?
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Code>{nonFatalImportErrors}</Code>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      </GenericInfo>

    </Container>
  );
}