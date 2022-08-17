import { getSessionAggregationInfo, setSessionAggregationInfo } from "./storage";

const currentVersion: number = 1;

export interface SessionAggregationInfo {
    currentVersion: number,
    totalLaunches: number,
    launchesThisVersion: number,
    infoButtonPopoverShown: boolean
}

export const defaultSessionAggregationInfo: SessionAggregationInfo = {
    currentVersion: currentVersion,
    totalLaunches: 0,
    launchesThisVersion: 0,
    infoButtonPopoverShown: false
}

export const recordSession = () => {

    //uncomment this if you want a quick way to just reset everything
    //setSessionAggregationInfo(defaultSessionAggregationInfo)

    const currentSessionInfo = getSessionAggregationInfo()
    if (currentSessionInfo.currentVersion !== currentVersion) {
        currentSessionInfo.currentVersion = currentVersion
        currentSessionInfo.launchesThisVersion = 0
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

