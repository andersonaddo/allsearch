import { useEffect, useState } from "react";
import { fetchNewBackgroundInfoFromApi } from "./backgroundFetchApi";
import { BACKGROUND_INFO_STORAGE_KEY, clearKey, getBackgroundInfo_UNSAFE, getMiscSettingsConfig, setBackgroundInfo_UNSAFE } from "./storage";

export type BackgroundInfo = {
    timestamp: number
    url: string,
    author: string,
    sourceUrl: string,
    sourceName: string,
    isUserDefined: boolean,
    backgroundContainerFetchUrl: string,
    //^
    //For dynamically fetched photos, this is the same as the `url`
    //For user defined photos, this might point to our CORS proxy server
    //Note for considering BackgroundInfo in Allsearch config exports later on:
    //Any reasonably tech-savvy user should be able to get backgroundContainerFetchUrl
    //but looking at the website source or at their browser's localstorage, but I would
    //prefer if we don't make it even easier by making it part of exports. Think about that!
}

export type BackgroundInfoChangeEvent = CustomEvent<{ info: BackgroundInfo | null }>

fetchNewBackgroundImage(false) //Start out with this as soon as possible

export async function fetchNewBackgroundImage(forceNewDynamicBackground: boolean) {
    try {
        if (getMiscSettingsConfig().userDefinedBackgroundEnabled) return
        if (!forceNewDynamicBackground && !isStoredBackgroundInfoStale(getBackgroundInfo_UNSAFE())) return;

        const newInfo = await fetchNewBackgroundInfoFromApi()
        setBackgroundInfo_UNSAFE(newInfo)
        broadcastNewBackgroundInfo(newInfo)
    } catch (e: any) {
        console.error(e)
    }
}

/**
 * Returns null if the stored background image info is stale
 */
export const getBackgroundImageInfoOneShot = () => {
    const storedInfo = getBackgroundInfo_UNSAFE()
    if (isStoredBackgroundInfoStale(storedInfo)) return null;
    return storedInfo;
}

//Custom hooks
//https://reactjs.org/docs/hooks-custom.html
export const useBackgroundImageInfo = (): BackgroundInfo | null => {
    const [backgroundImageInfo, setBackgroundImageInfo] = useState<BackgroundInfo | null>(null)

    useEffect(() => {
        function changeHandler(e: BackgroundInfoChangeEvent) {
            setBackgroundImageInfo(e.detail.info)
        }

        subscribeToDetailsChange(changeHandler)
        return () => unsubscribeFromDetailsChange(changeHandler)
    }, [])

    return backgroundImageInfo;
}

export function setUserDefinedBackgroundViaURL(url: string, backgroundContainerFetchUrl: string): void {
    const newInfo: BackgroundInfo = {
        timestamp: 0,
        url,
        author: "",
        sourceUrl: "",
        sourceName: "",
        isUserDefined: true,
        backgroundContainerFetchUrl
    }

    setBackgroundInfo_UNSAFE(newInfo)
    broadcastNewBackgroundInfo(newInfo)
}

export function clearBackgroundInfo() {
    broadcastNewBackgroundInfo(null)
    clearKey(BACKGROUND_INFO_STORAGE_KEY)
}

function isStoredBackgroundInfoStale(storedInfo: BackgroundInfo | null): storedInfo is null {
    if (!storedInfo) return true;
    if (storedInfo.isUserDefined) return false; //User defined images stay valid forever
    const fetchDate = new Date(storedInfo.timestamp)
    const currentDate = new Date();

    //Never mind the fact that this would return true if you last used Allsearch exactly
    //a month ago :)
    if (fetchDate.getDate() !== currentDate.getDate()) return true;
    return false;
}

function subscribeToDetailsChange(callback: (e: BackgroundInfoChangeEvent) => void) {
    //"allsearchBackgroundInfoChange" added to type system in src/types/events.d.ts

    //If there's already non-stale background information at hand, call the callback on that immediately
    const storedInfo = getBackgroundInfo_UNSAFE()
    if (!isStoredBackgroundInfoStale(storedInfo))
        callback(new CustomEvent("allsearchBackgroundInfoChange", { detail: { info: storedInfo } }))

    document.addEventListener("allsearchBackgroundInfoChange", callback);
}

function unsubscribeFromDetailsChange(callback: (e: BackgroundInfoChangeEvent) => void) {
    document.removeEventListener("allsearchBackgroundInfoChange", callback);
}

function broadcastNewBackgroundInfo(info: BackgroundInfo | null) {
    const event: BackgroundInfoChangeEvent =
        new CustomEvent("allsearchBackgroundInfoChange", { detail: { info: info } });
    document.dispatchEvent(event);
}