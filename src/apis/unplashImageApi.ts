import axios, { AxiosResponse } from 'axios';
import { desiredImageHeight, getImageCategorySearchParams } from '../utils/backgroundFetchApi';
import { BackgroundInfo } from '../utils/backgroundProvider';
import { getRandomInt } from '../utils/utils';

//https://unsplash.com/documentation#get-a-random-photo
type PartialUnsplashResponseType = Array<{
    created_at: string
    updated_at: string
    width: number
    height: number
    color: string
    description: string
    location: Location
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
    },
    links: {
        self: string
        html: string
    }
    user: {
        id: string
        updated_at: string
        username: string
        name: string
        portfolio_url: string
        bio: string
        location: string
        instagram_username: string
        twitter_username: string
        links: {
            self: string
            html: string
            photos: string
            portfolio: string
        }
    }
}>

//https://unsplash.com/documentation
const unplashApi = axios.create({
    baseURL: 'https://api.unsplash.com/',
    timeout: 10000,
    headers: {
        "Accept-Version": "v1",
        "Authorization": `Client-ID ${process.env.REACT_APP_UNPLASH_API_ACCESS_KEY}`
    }
});

export const fetchBackgroundFromUnplash = async (): Promise<BackgroundInfo> => {
    
    const results: AxiosResponse<Partial<PartialUnsplashResponseType>> = await unplashApi.get("/photos/random", {
        params: {
            orientation: "landscape",
            query: getImageCategorySearchParams(),
            count: 25 //max is 30
        }
    })

    const chosenIndex = getRandomInt(results.data.length)

    //Format the url a bit first...
    //Makes use of imgix
    //https://unsplash.com/documentation#dynamically-resizable-images
    let url = results.data.at(chosenIndex)?.urls?.raw ?? ""
    if (url) url += `&auto=format,enhance&height=${desiredImageHeight}&q=85`


    return {
        url: url,
        author: results.data.at(chosenIndex)?.user?.name || "",
        sourceUrl: results.data.at(chosenIndex)?.links?.html || "",
        timestamp: new Date().getTime(),
        sourceName: "Unsplash"
    }
}