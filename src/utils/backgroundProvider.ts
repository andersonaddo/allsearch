import { useEffect, useState } from "react";
import {  fetchNewBackgroundInfoFromApi } from "./backgroundFetchApi";
import { getStoredBackgroundInfo, setStoredBackgroundInfo } from "./storage";

export type BackgroundInfo = {
    timestamp: number
    url: string,
    author: string,
    sourceUrl: string,
    sourceName: string
}

export type BackgroundInfoChangeEvent = CustomEvent<{ info: BackgroundInfo }>

fetchBackgroundImage(false) //Start out with this as soon as possible

export async function fetchBackgroundImage(force: boolean) {
    try {
        if (!force && !isStoredBackgroundInfoStale(getStoredBackgroundInfo())) return;
        const newInfo = await fetchNewBackgroundInfoFromApi()
        const event: BackgroundInfoChangeEvent =
            new CustomEvent("allsearchBackgroundInfoChange", { detail: { info: newInfo } });
        setStoredBackgroundInfo(newInfo)
        document.dispatchEvent(event);
    } catch (e: any) {
        console.error(e)
    }
}

function isStoredBackgroundInfoStale(storedInfo: BackgroundInfo | null): storedInfo is null {
    if (!storedInfo) return true;
    const fetchDate = new Date(storedInfo.timestamp)
    const currentDate = new Date();

    //Never mind the fact that this would return true if you last used Allsearch exactly
    //a month ago :)
    if (fetchDate.getDate() !== currentDate.getDate()) return true;
    return false;
}


function subscribeToDetailsChange(callback: (e: BackgroundInfoChangeEvent) => void, lastSeenInfo: BackgroundInfo | null) {
    //If there's already something good stored, we can make use of that immediately
    //by artificially dispatching an event to the callback before subscribing
    //"allsearchBackgroundInfoChange" added to type system in src/types/events.d.ts

    const storedInfo = getStoredBackgroundInfo()
    if (storedInfo?.timestamp !== lastSeenInfo?.timestamp && !isStoredBackgroundInfoStale(storedInfo))
        callback(new CustomEvent("allsearchBackgroundInfoChange", { detail: { info: storedInfo } }))

    document.addEventListener("allsearchBackgroundInfoChange", callback);
}

function unsubscribeFromDetailsChange(callback: (e: BackgroundInfoChangeEvent) => void) {
    document.removeEventListener("allsearchBackgroundInfoChange", callback);
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