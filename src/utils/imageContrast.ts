//Design on this inspired by https://css-tricks.com/nailing-the-perfect-contrast-between-light-text-and-a-background-image/
//which is based on https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-procedure

export interface RGBColor {
  r: number,
  g: number,
  b: number
}

// Using binary search to try and find the best opacity
export const findOptimalOverlayOpacity = (
  textColor: RGBColor,
  overlayColor: RGBColor,
  imageData: ImageData
): number => {

  //https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0#qr-visual-audio-contrast-contrast
  //If it wasn't for the fact that our main page also has small text, we could have used 3
  //It's supposed ot be 4.5 but I increased it a bit based on empirical findings
  const desiredContrast = 9;

  const averageColor = getAverageImageColor(imageData);
  if (getContrast(textColor, averageColor) >= desiredContrast) return 0;

  const searchBounds = {
    lower: 0,
    midpoint: 0.5,
    upper: 1,
  };

  let numberOfGuesses = 0;
  const maxGuesses = 6;

  while (numberOfGuesses < maxGuesses) {
    numberOfGuesses++;
    const currentGuess = searchBounds.midpoint;

    //Get the contrast with the overlay at the current guess...
    const averageColorPlusOverlay = mixColors(averageColor, overlayColor, currentGuess);
    const resultantContrast = getContrast(textColor, averageColorPlusOverlay);

    if (resultantContrast < desiredContrast) {
      searchBounds.lower = currentGuess;
    }
    else if (resultantContrast > desiredContrast) {
      searchBounds.upper = currentGuess;
    }

    searchBounds.midpoint = ((searchBounds.upper - searchBounds.lower) / 2) + searchBounds.lower;
  }

  const optimalOpacity = searchBounds.midpoint;
  return optimalOpacity;
}


const getAverageImageColor = (imageData: ImageData): RGBColor => {
  let r = 0;
  let g = 0;
  let b = 0;
  const numberOfPixels = imageData.data.length / 4
  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i]
    g += imageData.data[i + 1]
    b += imageData.data[i + 2]
  }
  return { r: r / numberOfPixels, g: g / numberOfPixels, b: b / numberOfPixels }
}

const getContrast = (color1: RGBColor, color2: RGBColor): number => {
  const color1_luminance = getRelativeLuminance(color1);
  const color2_luminance = getRelativeLuminance(color2);
  const lighterColorLuminance = Math.max(color1_luminance, color2_luminance);
  const darkerColorLuminance = Math.min(color1_luminance, color2_luminance);
  const contrast = (lighterColorLuminance + 0.05) / (darkerColorLuminance + 0.05);
  return contrast;
}


const getRelativeLuminance = (color: RGBColor): number => {
  return (0.2126 * normalSpaceToLuminositySpace(color.r) +
    0.7152 * normalSpaceToLuminositySpace(color.g) +
    0.0722 * normalSpaceToLuminositySpace(color.b));
}

const normalSpaceToLuminositySpace = (val: number): number => {
  val = val / 255;
  return val < 0.03928 ? (val / 12.92) : Math.pow((val + 0.055) / 1.055, 2.4);
}

const mixColors = (baseColor: RGBColor, overlayColor: RGBColor, overlayOpacity: number): RGBColor => {
  return {
    r: baseColor.r + (overlayColor.r - baseColor.r) * overlayOpacity,
    g: baseColor.g + (overlayColor.g - baseColor.g) * overlayOpacity,
    b: baseColor.b + (overlayColor.b - baseColor.b) * overlayOpacity,
  }
}