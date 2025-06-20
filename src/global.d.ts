import ZoomAPI from "@/core/ZoomAPI";

declare global {
  interface Window {
    zoomAPI: ZoomAPI;
  }
}