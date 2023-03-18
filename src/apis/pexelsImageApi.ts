import axios, { AxiosResponse } from 'axios';
import { desiredImageHeight, getImageCategorySearchParams } from '../utils/backgroundFetchApi';
import { BackgroundInfo } from '../utils/backgroundProvider';
import { getRandomInt } from '../utils/utils';

//https://www.pexels.com/api/documentation/#photos-curated
interface PexelsResponseType {
    photos: Array<
        {
            id: number;
            width: number;
            height: number;
            url: string;
            photographer: string;
            photographer_url: string;
            photographer_id: number;
            avg_color: string;
            src: {
                original: string;
                large2x: string;
                large: string;
                medium: string;
                small: string;
                portrait: string;
                landscape: string;
                tiny: string;
            };
            liked: boolean;
            alt: string;
        }>
}

const pexelsApi = axios.create({
    baseURL: 'https://api.pexels.com/v1/',
    timeout: 10000,
    headers: {
        "Authorization": `${process.env.REACT_APP_PEXELS_API_ACCESS_KEY}`
    }
});

export const fetchBackgroundFromPexels = async (): Promise<BackgroundInfo> => {

    const results: AxiosResponse<Partial<PexelsResponseType>> = await pexelsApi.get("/search", {
        params: {
            orientation: "landscape",
            query: getImageCategorySearchParams(),
            size: "large",
            per_page: 50 //max is 80
        }
    })

    const chosenIndex = getRandomInt(results.data.photos?.length)

    //Format the url a bit first...
    //Makes use of imgix
    let url = results.data.photos?.at(chosenIndex)?.src?.original ?? ""
    if (url) url += `?auto=format,enhance&height=${desiredImageHeight}&q=85`

    return {
        url: url,
        author: results.data.photos?.at(chosenIndex)?.photographer || "",
        sourceUrl: results.data.photos?.at(chosenIndex)?.url || "",
        timestamp: new Date().getTime(),
        sourceName: "Pexels",
        isUserDefined: false
    }
}