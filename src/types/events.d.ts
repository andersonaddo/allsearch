import { BackgroundInfoChangeEvent } from "../utils/backgroundProvider";

export {}; //To make this a module and accessible to TS type system

//More info https://stackoverflow.com/questions/43001679/how-do-you-create-custom-event-in-typescript

declare global {
    interface DocumentEventMap {
      'allsearchBackgroundInfoChange': BackgroundInfoChangeEvent;
    }
  }