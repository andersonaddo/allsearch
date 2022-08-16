import { Flex, HStack, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { BsFillHouseFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { ExtraSettingsPanel } from "../components/ExtraSettingsPanel";
import { MacroList } from "../components/HotbarEditMacroList";
import { SearchEngineList } from "../components/HotbarEditSearchEngineList";
import SettingsFooter from "../components/SettingsFooter";
import { defaultSearchEngineCategories } from "../data/defaultSearchEngines";

export const Settings = () => {

  const navigate = useNavigate();

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


      <Tabs variant='enclosed' isLazy align="center" flex={1}>
        <TabList>
          {
            Object.values(defaultSearchEngineCategories).map(category => {
              return <Tab key={category.title}>{category.title}</Tab>
            })
          }
          <Tab>Custom Engines</Tab>
          <Tab>Macros</Tab>
          <Tab>Extra Settings</Tab>
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
            <ExtraSettingsPanel />
          </TabPanel>

        </TabPanels>
      </Tabs>
      <SettingsFooter />
    </Flex>
  );
}