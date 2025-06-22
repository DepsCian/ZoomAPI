import ZoomAPI from "@/core/ZoomAPI";

const zoomAPI = new ZoomAPI('debug');
await zoomAPI.init()
window.zoomAPI = zoomAPI