import { useEffect, useState } from "react";
import { fetchNewBackgroundInfoFromApi } from "./backgroundFetchApi";
import { BACKGROUND_INFO_STORAGE_KEY, clearKey, getBackgroundInfo, getMiscSettingsConfig, setBackgroundInfo } from "./storage";

export type BackgroundInfo = {
    timestamp: number
    url: string,
    author: string,
    sourceUrl: string,
    sourceName: string,
    isUserDefined: boolean
}

export type BackgroundInfoChangeEvent = CustomEvent<{ info: BackgroundInfo | null }>

fetchNewBackgroundImage(false) //Start out with this as soon as possible

export async function fetchNewBackgroundImage(forceNewDynamicBackground: boolean) {
    try {
        if (getMiscSettingsConfig().userDefinedBackgroundEnabled) return
        if (!forceNewDynamicBackground && !isStoredBackgroundInfoStale(getBackgroundInfo())) return;

        const newInfo = await fetchNewBackgroundInfoFromApi()
        setBackgroundInfo(newInfo)
        broadcastNewBackgroundInfo(newInfo)
    } catch (e: any) {
        console.error(e)
    }
}

//Custom hooks
//https://reactjs.org/docs/hooks-custom.html
export const useBackgroundImageInfo = (): BackgroundInfo | null => {
    const [backgroundImageInfo, setBackgroundImageInfo] = useState<BackgroundInfo | null>(null)

    useEffect(() => {
        function changeHandler(e: BackgroundInfoChangeEvent) {
            setBackgroundImageInfo(e.detail.info)
        }

        subscribeToDetailsChange(changeHandler, backgroundImageInfo)
        return () => unsubscribeFromDetailsChange(changeHandler)
    })

    return backgroundImageInfo;
}

export function setUserDefinedBackgroundViaURL(url: string): void {
    const newInfo: BackgroundInfo = {
        timestamp: 0,
        url,
        author: "",
        sourceUrl: "",
        sourceName: "",
        isUserDefined: true,
    }

    setBackgroundInfo(newInfo)
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
    //a year ago :)
    if (fetchDate.getDate() !== currentDate.getDate()) return true;
    return false;
}

function subscribeToDetailsChange(callback: (e: BackgroundInfoChangeEvent) => void, lastSeenInfo: BackgroundInfo | null) {
    //If there's already something good stored, we can make use of that immediately
    //by artificially dispatching an event to the callback before subscribing.
    //"allsearchBackgroundInfoChange" added to type system in src/types/events.d.ts

    const storedInfo = getBackgroundInfo()
    if (storedInfo?.timestamp !== lastSeenInfo?.timestamp && !isStoredBackgroundInfoStale(storedInfo))
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