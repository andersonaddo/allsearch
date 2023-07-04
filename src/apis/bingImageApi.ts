import axios, { AxiosResponse } from 'axios';
import { BackgroundInfo } from '../utils/backgroundProvider';

//TODO: If this project ever becomes commercial, I might have to disable this since 
//the images here miiiight not be available for commercial use...

//https://stackoverflow.com/questions/10639914/is-there-a-way-to-get-bings-photo-of-the-day
//was running into CORS issues and didn't want to deploy a proxy server, so I changed to this
//https://github.com/TimothyYe/bing-wallpaper

interface BingResponseType {
    url?: string;
    copyright?: string;
    copyright_link?: string;
}

const bingApi = axios.create({
    baseURL: 'https://bing.biturl.top/',
    timeout: 10000,
});

export const fetchBackgroundFromBing = async (): Promise<BackgroundInfo> => {

    const results: AxiosResponse<Partial<BingResponseType>> = await bingApi.get("/", {
        params: {
            index: "random",
            mkt: "random"
        }
    })

    //Format the url a bit first...
    //Makes use of imgix
    let url = results.data.url ?? ""

    return {
        url: url,
        //https://stackoverflow.com/a/10459537/5731044
        author:  results.data.copyright?.match(/\(([^)]*)\)[^(]*$/)?.at(1)?.replaceAll("©", "") ?? "",
        sourceUrl: results.data.copyright_link || "",
        timestamp: new Date().getTime(),
        sourceName: "Bing",
        isUserDefined: false,
        backgroundContainerFetchUrl: url
    }
}