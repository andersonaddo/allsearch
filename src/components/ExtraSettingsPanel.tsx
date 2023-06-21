import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Checkbox, Code, Divider, FormControl, FormErrorMessage, FormLabel,
  Heading, Input, Text, useDisclosure, useToast, VStack
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ConfigImport, NonFatalImportErrors } from "../types/importExportTypes";
import { clearBackgroundInfo, fetchNewBackgroundImage, setUserDefinedBackgroundViaURL } from "../utils/backgroundProvider";
import { exportAllsearchConfiguration, importAllsearchConfiguration } from "../utils/importExport";
import {
  ACTIVE_RULES_STORAGE_KEY, clearKey, CUSTOM_ENG_STORAGE_KEY,
  EXTRA_MISC_SETTINGS, getBackgroundInfo, getMiscSettingsConfig, HOTBAR_STORAGE_KEY, MACROS_STORAGE_KEY,
  ONBOARDING_AGG_INFO_STORAGE_KEY,
  setMiscSettingsConfig,
  STORED_RULES_STORAGE_KEY
} from "../utils/storage";
import { isInDevMode } from "../utils/utils";
import GenericInfo from "./GenericInfo";
import GenericWarning from "./GenericWarning";
import Spacer from "./Spacer";
import URLInputField from "./URLInputField";

export const ExtraSettingsPanel = () => {

  const [invalidFileInput, setInvalidFileInput] = useState(false)
  const [importErrorMessage, setImportErrorMessage] = useState("")
  const [nonFatalImportErrors, setNonFatalImportErrors] = useState("")

  const [clipboardCheckboxChecked, setClipboardCheckboxChecked] = useState(false)
  const [userDefinedBackgroundCheckboxChecked, setUserDefinedBackgroundCheckboxChecked] = useState(false)
  const [userDefinedBackgroundUrlValid, setSserDefinedBackgroundUrlValid] = useState(false)
  const userDefinedBackgroundUrl = useRef<string>("")

  const { isOpen: isImportModalOpen, onOpen: setImportModalOpen, onClose: setImportModalClose } = useDisclosure()
  const { isOpen: isNonFatalModalOpen, onOpen: setNonFatalModalOpen, onClose: setNonFatalModalClose } = useDisclosure()
  const { isOpen: isInfoModalOpen, onOpen: setInfoModalOpen, onClose: setInfoModalClose } = useDisclosure()
  const { isOpen: isResetModalOpen, onOpen: setResetModalOpen, onClose: setResetModalClose } = useDisclosure()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const toast = useToast()


  useEffect(() => {
    setClipboardCheckboxChecked(getMiscSettingsConfig().readFromClipboardForQuery)
    setUserDefinedBackgroundCheckboxChecked(getMiscSettingsConfig().userDefinedBackgroundEnabled)
  }, [])


  //TODO: currently this checks for type matches (so like, strings should be strings)
  //But doesn't check for things like queries having {searchTerms} in them
  async function importConfiguration() {
    const file = fileInputRef.current?.files?.item(0)
    setInvalidFileInput(!file)
    if (!file) return;
    const result = (await readFile(file)).target?.result
    if (typeof result != "string") throw new Error("Bad File!")
    const importObj: ConfigImport = JSON.parse(result)

    //We're dealing with arbitrary files, so this can be super error prone
    await importAllsearchConfiguration(
      importObj,
      (nonFatalImportErrors) => {
        setNonFatalImportErrors(generateNonFatalErrorImportReport(nonFatalImportErrors))
        setNonFatalModalOpen()
      },
      (err) => {
        if (isInDevMode()) console.error(err)
        setImportErrorMessage(err?.message)
        setInfoModalOpen()
      }
    )
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
    <VStack
      alignItems={"flex-start"} justifyContent={"center"} padding={"0px 16px"}
    >

      <Heading>Extra Functionality</Heading>

      <Checkbox
        isChecked={clipboardCheckboxChecked}
        onChange={(e) => {
          setMiscSettingsConfig({ ...getMiscSettingsConfig(), readFromClipboardForQuery: e.target.checked })
          setClipboardCheckboxChecked(!clipboardCheckboxChecked)
        }}
        mb="4"
      >
        Pressing the <Code>`</Code> key fills the search bar with the contents of the clipboard. Doesn't work for Firefox.
      </Checkbox>

      <Checkbox
        isChecked={userDefinedBackgroundCheckboxChecked}
        onChange={(e) => {
          setMiscSettingsConfig({ ...getMiscSettingsConfig(), userDefinedBackgroundEnabled: e.target.checked })
          //If it's been unchecked, fetch a new background. Otherwise, clear the background info
          if (!e.target.checked) {
            fetchNewBackgroundImage(true)
          } else {
            clearBackgroundInfo()
          }
          setUserDefinedBackgroundCheckboxChecked(e.target.checked)
        }}
        mb="4"
      >
        User defined Allsearch background.
      </Checkbox>


      {userDefinedBackgroundCheckboxChecked &&
        <VStack>
          <URLInputField
            label="Background URL"
            initialValue={(getBackgroundInfo()?.isUserDefined && getBackgroundInfo()?.url) || ""}
            helperText="If the URL is valid but the homepage background is still blank, it's probably because the URL's server is rejecting Allsearch. This is rare, but can happen. Try another photo."
            onValidityChange={(isValid) => setSserDefinedBackgroundUrlValid(isValid)}
            onValueChange={(value) => userDefinedBackgroundUrl.current = value}
            isRequired={true}
            isDisabled={!userDefinedBackgroundCheckboxChecked}
          />

          <Button
            isDisabled={!userDefinedBackgroundUrlValid}
            onClick={() => {
              setUserDefinedBackgroundViaURL(userDefinedBackgroundUrl.current)
              toast({
                title: 'Background Saved!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })

            }}>
            Save
          </Button>

        </VStack>

      }

      <SectionSeparator />
      <Heading>Import/Export</Heading>

      <Text m="2">
        Export your Allsearch configuration to a plain text file to allow others to import it.
      </Text>
      <Button onClick={exportAllsearchConfiguration}>Export Allsearch Configuration</Button>

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


      <SectionSeparator />
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
                What exactly went wrong?
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Code>{nonFatalImportErrors}</Code>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      </GenericInfo>

    </VStack>
  );
}


const SectionSeparator = () => {
  return (
    <>
      <Spacer size={8} axis={"vertical"} />
      <Divider />
      <Divider />
      <Spacer size={8} axis={"vertical"} />
    </>
  )
}