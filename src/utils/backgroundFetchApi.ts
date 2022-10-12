import { fetchBackgroundFromBing } from "../apis/bingImageApi";
import { fetchBackgroundFromPexels } from "../apis/pexelsImageApi";
import { fetchBackgroundFromUnplash } from "../apis/unplashImageApi";
import { holidaySpecs } from "../data/holidays";
import { BackgroundInfo } from "./backgroundProvider";
import { getRandomInt } from "./utils";

export const desiredImageHeight = 1260;

export const getImageCategorySearchParams = () => {

    //If it's something like holidays, return something specific!
    const now = new Date()
    for (const holidaySpec of holidaySpecs) {
        if (now.getDate() === holidaySpec.day && now.getMonth() === holidaySpec.month) {
            return holidaySpec.query[getRandomInt(holidaySpec.query.length)]
        }
    }

    const possibleQueries = [
        "nature", "landscape", "scenery",
        "architecture", "civilization", "travel", "skyline",
        "city", "travel", "ocean", "sealife", "beach", "roadtrip", "aerial",
        "clouds", "autumn", "space", "astronomy", "gravel", "texture", 
        "desert", "stream", "river", "island", "railroad", "view",
        "grand canyon", "yellowstone", "Banff", "serengeti scenery", "serengeti", "Seoul",
        "Salar de Uyuni", "Aurora Borealis", "Cliffs of Moher", "Causeway", "Seascape",
        "rainforest", "hawaii", "Antelope Canyon", "sea life", "galaxies", "dew drops",
        "mountains"
    ]

    return possibleQueries[getRandomInt(possibleQueries.length)]
}

//Error handling is handled by caller
export const fetchNewBackgroundInfoFromApi = async (): Promise<BackgroundInfo> => {
    //20% change Unplash (worse results and smaller quota), 20% Bing, 60% pexels
    let results = null;

    const choice = getRandomInt(100);
    if (choice < 20) results = await fetchBackgroundFromUnplash()
    else if (choice < 40) results = await fetchBackgroundFromBing()
    else results = await fetchBackgroundFromPexels();
    
    return results;
}