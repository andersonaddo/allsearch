import { getSessionAggregationInfo, setSessionAggregationInfo } from "./storage";

export const currentVersionForOnboarding: number = 2;

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

