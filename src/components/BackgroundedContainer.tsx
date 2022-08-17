import { Container, ContainerProps } from "@chakra-ui/react";
import * as React from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import "../styling/BackgroundContainer.css";
import { useBackgroundImageInfo } from "../utils/backgroundProvider";
import { findOptimalOverlayOpacity, RGBColor } from "../utils/imageContrast";

const contrastCanvasDim = 150
const blur = 0;
const fadeTime = 1.0;
const chosenTextColor: RGBColor = { r: 255, g: 255, b: 255 }
const overlayColor: RGBColor = { r: 0, g: 0, b: 0 }

export const BackgroundedContainer: React.FC<PropsWithChildren<ContainerProps>> = (props) => {
    const [sourceLoaded, setSourceLoaded] = useState<string | null>(null)
    const [overlayOpacity, setOverlayOpacity] = useState<number>(0)
    const backgroundInfo = useBackgroundImageInfo();


    const processImageForOverlayDarkness = React.useCallback((img: HTMLImageElement, src: string) => {
        //on getting canvas data: https://stackoverflow.com/a/10755011/5731044
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = contrastCanvasDim
        canvas.height = contrastCanvasDim;

        if (!context) {
            canvas.remove()
            return;
        }

        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, contrastCanvasDim, contrastCanvasDim);
        const canvasData = context.getImageData(0, 0, contrastCanvasDim, contrastCanvasDim);
        setOverlayOpacity(findOptimalOverlayOpacity(chosenTextColor, overlayColor, canvasData))
        setSourceLoaded(src)
        canvas.remove()
    }, []);


    //Lazy loading (and processing) the image for speed
    useEffect(() => {
        if (!backgroundInfo) return;
        const img = new Image()
        //Enable CORS for the image so it can be used by the canvas in processImageForOverlayDarkness later...
        //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
        img.crossOrigin = "Anonymous"
        img.src = backgroundInfo.url;
        img.onload = () => processImageForOverlayDarkness(img, backgroundInfo.url)
    }, [processImageForOverlayDarkness, backgroundInfo])


    //some useful css tricks: https://css-tricks.com/design-considerations-text-images/
    return (
        <Container
            position="relative" //Need this so _before inherits width and height
            _before={!sourceLoaded ? undefined : {
                content: "''",
                position: "absolute",
                minWidth: "100%",
                minHeight: "100%",
                zIndex: -1,
                background: `linear-gradient(
                    rgba(0, 0, 0, ${overlayOpacity}),
                    rgba(0, 0, 0, ${overlayOpacity})
                  ), url(${sourceLoaded})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                animationFillMode: "forwards",
                //Keyframes for fade-in defined in BackgroundContainer.css
                animation: `fade-in ${fadeTime}s ease`,
                filter: `blur(${blur}px)`,
            }}
            {...props}
        />
    )
}