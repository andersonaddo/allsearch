import { getSessionAggregationInfo, setSessionAggregationInfo } from "./storage";

//Increment this when you want to let users know (via a cute popup :3) when there's new things.
//The popup will point users to the About page.
//------REMEMBER TO UPDATE THE MODAL (src/components/NewVersionModal.tsx) WITH NEW INFO PERTAINING TO THIS NEW VERSION------
//(that modal also has the ability to do things needed to migrate between versions on first visit of a new version)
export const currentVersionForOnboarding: number = 5;

export interface SessionAggregationInfo {
    currentVersion: number,
    versionInLastSession: number
    totalLaunches: number,
    launchesThisVersion: number,
    infoButtonAllsearchIntroductionShown: boolean
    newVersionModalShown: boolean
}

export const recordSession = () => {

    //uncomment this if you want a quick way to just reset everything
    //setSessionAggregationInfo(defaultSessionAggregationInfo)

    const currentSessionInfo = getSessionAggregationInfo()
    currentSessionInfo.versionInLastSession = currentSessionInfo.currentVersion

    if (currentSessionInfo.currentVersion !== currentVersionForOnboarding) {
        currentSessionInfo.currentVersion = currentVersionForOnboarding
        currentSessionInfo.launchesThisVersion = 0
        currentSessionInfo.newVersionModalShown = false;
    }

    currentSessionInfo.launchesThisVersion++;
    currentSessionInfo.totalLaunches++;
    setSessionAggregationInfo(currentSessionInfo)
}

export const shouldShowInfoButtonAllsearchIntroduction = () => {
    const currentSessionInfo = getSessionAggregationInfo()
    return currentSessionInfo.totalLaunches === 1 && !currentSessionInfo.infoButtonAllsearchIntroductionShown
}

export const recordInfoButtonIntroductionShown = (): void => {
    const currentSessionInfo = getSessionAggregationInfo()
    currentSessionInfo.infoButtonAllsearchIntroductionShown = true;
    setSessionAggregationInfo(currentSessionInfo)
}

export const shouldShowNewVersionModal = () => {
    const currentSessionInfo = getSessionAggregationInfo()
    return currentSessionInfo.currentVersion !== currentSessionInfo.versionInLastSession &&
        !currentSessionInfo.newVersionModalShown
}

export const recordNewVersionModalShown = (): void => {
    const currentSessionInfo = getSessionAggregationInfo()
    currentSessionInfo.newVersionModalShown = true;
    setSessionAggregationInfo(currentSessionInfo)
}