import { EasyStore } from "./types";
import ZoomAPI from "./zoomAPI";

declare global {
  interface Window {
    [key: number]: Window;
    WCSockets?: {
      instance?: {
        RWG?: {
          socket?: WebSocket;
        };
      };
    };
    easyStore?: EasyStore
    zoomAPI: ZoomAPI
  }
}

export {};