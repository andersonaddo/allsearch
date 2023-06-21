import { Container, ContainerProps } from "@chakra-ui/react";
import * as React from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useBackgroundImageInfo } from "../utils/backgroundProvider";
import { findOptimalOverlayOpacity, RGBColor } from "../utils/imageContrast";

const contrastCanvasDim = 150
const blur = 0;
const fadeTime = 1.0;
const chosenTextColor: RGBColor = { r: 255, g: 255, b: 255 }
const overlayColor: RGBColor = { r: 0, g: 0, b: 0 }

export const BackgroundedContainer: React.FC<PropsWithChildren<ContainerProps>> = (props) => {
    const [loadedImgSourceUrl, setLoadedImgSourceUrl] = useState<string | null>(null)
    const [overlayOpacity, setOverlayOpacity] = useState<number>(0)
    const backgroundInfo = useBackgroundImageInfo();

    const fetchFromCORSProxy = React.useCallback((url: string) => {
        return `${process.env.REACT_APP_ALLORIGINS_CORS_PROXY_SERVER}/raw?url=${encodeURIComponent(url)}`
    }, [])

    const attemptLoadInImage = React.useCallback((url: string) => new Promise<{ img: HTMLImageElement, url: string } | null>((resolve) => {
        const img = new Image();
        //Enable CORS for the image so it can be used by the canvas in processImageForOverlayDarkness later...
        //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
        //https://stackoverflow.com/a/51471111/5731044
        img.crossOrigin = "Anonymous"
        img.addEventListener('load', () => resolve({ img, url }));
        img.addEventListener('error', (e) => {
            console.error(e)
            resolve(null)
        });
        img.src = url;
    }), []);


    //First see if you can do it without our CORS proxy server, then try the proxy if you fail.
    //We assume any error is due to CORS. If it isn't, no biggie; the CORS proxy will probably just fail too
    const loadInInMemoryImage = React.useCallback(async (url: string) => {
        let results = await attemptLoadInImage(url);
        if (!results) results = await attemptLoadInImage(fetchFromCORSProxy(url));
        return results
    }, [fetchFromCORSProxy, attemptLoadInImage])

    const calculateImageOverlayAndRender = React.useCallback((img: HTMLImageElement, src: string) => {
        //on getting canvas data: https://stackoverflow.com/a/10755011/5731044
        const temporaryCanvas = document.createElement('canvas');
        const context = temporaryCanvas.getContext('2d');
        temporaryCanvas.width = contrastCanvasDim
        temporaryCanvas.height = contrastCanvasDim;

        if (!context) {
            temporaryCanvas.remove()
            return;
        }

        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, contrastCanvasDim, contrastCanvasDim);
        const canvasData = context.getImageData(0, 0, contrastCanvasDim, contrastCanvasDim);
        setOverlayOpacity(findOptimalOverlayOpacity(chosenTextColor, overlayColor, canvasData))
        setLoadedImgSourceUrl(src)
        temporaryCanvas.remove()
    }, []);


    //Lazy loading (and processing) the image for speed
    //The image is loaded on a temporary img element, and only transferred to the Container
    //in the DOM when it's fully loaded in (so we can do a smooth transition)
    useEffect(() => {
        if (!backgroundInfo) return;
        loadInInMemoryImage(backgroundInfo.url).then(results => {
            if (!results) return
            calculateImageOverlayAndRender(results.img, results.url)
        })
    }, [calculateImageOverlayAndRender, backgroundInfo, loadInInMemoryImage])


    //some useful css tricks: https://css-tricks.com/design-considerations-text-images/
    return (
        <Container
            position="relative" //Need this so _before inherits width and height
            _before={!loadedImgSourceUrl ? undefined : {
                content: "''",
                position: "fixed",
                top: "0px",
                minWidth: "100%",
                minHeight: "100%",
                zIndex: -1,
                background: `linear-gradient(
                    rgba(0, 0, 0, ${overlayOpacity}),
                    rgba(0, 0, 0, ${overlayOpacity})
                  ), url(${loadedImgSourceUrl})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                animationFillMode: "forwards",
                //Keyframes for fade-in defined in Main.css
                animation: `fade-in ${fadeTime}s ease`,
                filter: `blur(${blur}px)`,
            }}
            {...props}
        />
    )
}