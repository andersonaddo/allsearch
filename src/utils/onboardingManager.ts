import { getSessionAggregationInfo, setSessionAggregationInfo } from "./storage";

//Increment this when you want to let users know (via a cute popup :3) when there's new things.
//The popup will point users to the About page.
export const currentVersionForOnboarding: number = 3;

export interface SessionAggregationInfo {
    currentVersion: number,
    totalLaunches: number,
    launchesThisVersion: number,
    infoButtonPopoverShown: boolean
}

export const recordSession = () => {

    //uncomment this if you want a quick way to just reset everything
    //setSessionAggregationInfo(defaultSessionAggregationInfo)

    const currentSessionInfo = getSessionAggregationInfo()
    if (currentSessionInfo.currentVersion !== currentVersionForOnboarding) {
        currentSessionInfo.currentVersion = currentVersionForOnboarding
        currentSessionInfo.launchesThisVersion = 0
        currentSessionInfo.infoButtonPopoverShown = false
    }

    currentSessionInfo.launchesThisVersion++;
    currentSessionInfo.totalLaunches++;
    setSessionAggregationInfo(currentSessionInfo)
}

export const recordInfoButtonPopoverShown = () : void => {
    const currentSessionInfo = getSessionAggregationInfo()
    currentSessionInfo.infoButtonPopoverShown = true;
    setSessionAggregationInfo(currentSessionInfo)
}


export const shouldShowInfoButtonPopover = () => {
    const currentSessionInfo = getSessionAggregationInfo()
    return currentSessionInfo.launchesThisVersion === 1 && !currentSessionInfo.infoButtonPopoverShown
}

export const showInfoButtonPopoverInNewUserMode = () => {
    const currentSessionInfo = getSessionAggregationInfo()
    return currentSessionInfo.launchesThisVersion === currentSessionInfo.totalLaunches
}

