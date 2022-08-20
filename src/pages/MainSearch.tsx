import { DarkMode, Flex, HStack, IconButton, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsFillGearFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import AllsearchTitle from "../components/AllsearchTitle";
import { BackgroundedContainer } from "../components/BackgroundedContainer";
import { MacroChip, SearchEngineChip } from "../components/HotbarChips";
import InfoButton from "../components/InfoButton";
import { fetchBackgroundImage, useBackgroundImageInfo } from "../utils/backgroundProvider";
import { getHotbar } from "../utils/storage";
import { getMacroFromId, getSearchEngineFromId } from "../utils/utils";


export const MainSearch = () => {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [getLastUnfocusedKey, setLastUnfocusedKey] = useState("");
  const [infoTextVisible, setInfoTextVisible] = useState(false)
  const [searchParams] = useSearchParams();
  const backgroundInfo = useBackgroundImageInfo();
  const navigate = useNavigate();
  const initializedWithURLSearchQuery = useRef(!!searchParams.get("q"))


  useEffect(() => {
    setQuery(searchParams.get("q") || "")
    setInfoTextVisible(initializedWithURLSearchQuery.current)
  }, [searchParams])




  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!e) return;
      if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;
      if (!isTyping) setLastUnfocusedKey(e.key)
    };

    document.addEventListener("keydown", handleKeyDown, false);
    return () => document.removeEventListener("keydown", handleKeyDown, false);
  }, [isTyping]);


  const hotbarEngines = useMemo(() => {
    const entries = Object.entries(getHotbar());
    const engineEntries = [];
    for (const val of entries) {
      if (val[1] !== "engine") continue
      const engine = getSearchEngineFromId(val[0]);
      if (engine) engineEntries.push(engine)
    }
    return engineEntries;
  }, [])


  const hotbarMacros = useMemo(() => {
    const entries = Object.entries(getHotbar());
    const macroEntries = [];
    for (const val of entries) {
      if (val[1] !== "macro") continue
      const macro = getMacroFromId(val[0]);
      if (macro) macroEntries.push(macro)
    }
    return macroEntries;
  }, [])



  function clearLastUnfocusedKey() {
    setLastUnfocusedKey("")
  }


  return (
    <DarkMode>
      <BackgroundedContainer centerContent maxWidth="100%" height="100vh" >
        <VStack height="100%" width="70%" spacing={"20"}>

          <HStack
            position="absolute"
            right="24px"
            top="24px">
            <IconButton
              aria-label="New Image"
              icon={<IoMdRefresh />}
              onClick={() => fetchBackgroundImage(true)}
              variant='ghost'
            />
            <InfoButton />
            <IconButton
              aria-label="Settings"
              icon={<BsFillGearFill />}
              onClick={() => navigate("./settings")}
              variant='ghost'
            />
          </HStack>


          <Text
            position="absolute"
            left="24px"
            bottom="24px"
            fontSize="sm"
          >
            <Link isExternal href={backgroundInfo?.sourceUrl}>
              {backgroundInfo?.author}
            </Link> from {backgroundInfo?.sourceName}
          </Text>

          <AllsearchTitle />

          <VStack width="100%">
            <Input
              autoFocus={!initializedWithURLSearchQuery.current}
              placeholder='Type something in!'
              fontSize={"18px"}
              fontWeight="bold"
              borderColor='gray.200'
              height={"60px"}
              backdropFilter="blur(3px)"
              border='2px'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
              }}
              onBlur={() => {
                setLastUnfocusedKey("")
                setIsTyping(false)
                setInfoTextVisible(true)
              }}
              onFocus={() => {
                setLastUnfocusedKey("")
                setIsTyping(true)
              }}
            />

              <Text className={`mainSearchInfo ${infoTextVisible ? undefined : "hide"}`}>
                Click an engine or press it's shortcut on your keyboard (letter in square brackets)
              </Text>

          </VStack>


          <Flex direction="row" flexWrap={"wrap"} justifyContent="center">
            {
              hotbarEngines.map((x, i) => <SearchEngineChip
                key={i}
                actionItem={x}
                userSearchQuery={query}
                lastTypedUnfocusedKey={getLastUnfocusedKey}
                onActivatedByShortcut={clearLastUnfocusedKey} />)
            }
            {
              hotbarMacros.map((x, i) => <MacroChip
                key={i}
                actionItem={x}
                userSearchQuery={query}
                lastTypedUnfocusedKey={getLastUnfocusedKey}
                onActivatedByShortcut={clearLastUnfocusedKey} />)
            }
          </Flex>
        </VStack>
      </BackgroundedContainer>
    </DarkMode>
  );
}