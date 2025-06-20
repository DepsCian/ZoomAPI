import ZoomAPI from "./zoomAPI";

const zoomAPI = new ZoomAPI();
await zoomAPI.init()
window.zoomAPI = zoomAPI