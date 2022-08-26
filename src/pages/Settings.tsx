import { Flex, HStack, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRef } from "react";
import { BsFillHouseFill } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { ExtraSettingsPanel } from "../components/ExtraSettingsPanel";
import { MacroList } from "../components/HotbarEditMacroList";
import { SearchEngineList } from "../components/HotbarEditSearchEngineList";
import { RulesList } from "../components/RulesList";
import SettingsFooter from "../components/SettingsFooter";
import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";
import { isInDevMode } from "../utils/utils";
import { DevSettingsPanel } from "../_dev/DevSettingsPanel";

export const Settings = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultIndex = useRef(parseInt(searchParams.get("index") ?? "0"))

  return (
    <Flex maxWidth={"100%"} direction="column" minHeight={"100vh"} paddingTop={"16px"}>

      <HStack alignSelf={"flex-end"} marginRight={"8px"} position="absolute">
        <ColorModeSwitcher />

        <IconButton
          aria-label="Home"
          icon={<BsFillHouseFill />}
          onClick={() => navigate("/")}
          variant='ghost'
        />
      </HStack>


      <Tabs variant='enclosed' isLazy align="center" flex={1} defaultIndex={defaultIndex.current}>
        <TabList>
          {
            Object.values(defaultSearchEngineCategories).map(category => {
              return <Tab key={category.title}>{category.title}</Tab>
            })
          }
          <Tab>Custom Engines</Tab>
          <Tab>Macros</Tab>
          <Tab>Rules</Tab>
          <Tab>Extra Settings</Tab>
          {isInDevMode() && <Tab borderColor={"red"} borderWidth="2px">DEV</Tab>}
        </TabList>

        <TabPanels>
          {
            Object.entries(defaultSearchEngineCategories).map(category => {
              return (
                <TabPanel key={category[1].title}>
                  <SearchEngineList key={category[0]} categoryId={category[0]} />
                </TabPanel>
              )
            })
          }

          <TabPanel>
            <SearchEngineList categoryId={"custom"} />
          </TabPanel>

          <TabPanel>
            <MacroList />
          </TabPanel>

          <TabPanel>
            <RulesList />
          </TabPanel>

          <TabPanel>
            <ExtraSettingsPanel />
          </TabPanel>

          {isInDevMode() &&
            <TabPanel>
              <DevSettingsPanel />
            </TabPanel>
          }

        </TabPanels>
      </Tabs>
      <SettingsFooter />
    </Flex>
  );
}