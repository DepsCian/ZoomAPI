// ==UserScript==
// @name       zoom-api
// @namespace  npm/vite-plugin-monkey
// @version    0.0.0
// @icon       https://vitejs.dev/logo.svg
// @match      https://app.zoom.us/wc/*
// @noframes
// ==/UserScript==

(async function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  function encodeToBase64(str) {
    if (str === null || str === void 0) {
      return "";
    }
    const uint8Array = new TextEncoder().encode(str);
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  class ZoomWS {
    constructor(socket) {
      __publicField(this, "socket");
      this.socket = socket;
    }
    sendMessage(message) {
      this.socket.send(JSON.stringify(message));
    }
  }
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };
  class Logger {
    constructor(level = "info") {
      __publicField(this, "currentLevel");
      this.currentLevel = level;
    }
    shouldLog(level) {
      return levels[level] <= levels[this.currentLevel];
    }
    error(message) {
      if (this.shouldLog("error")) {
        console.error(`[ERROR] ${message}`);
      }
    }
    warn(message) {
      if (this.shouldLog("warn")) {
        console.warn(`[WARN] ${message}`);
      }
    }
    info(message) {
      if (this.shouldLog("info")) {
        console.log(`[INFO] ${message}`);
      }
    }
    debug(message) {
      if (this.shouldLog("debug")) {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  }
  class ZoomAPI extends Logger {
    constructor() {
      super();
      __publicField(this, "zoomWS");
      __publicField(this, "store");
      this.zoomWS = null;
      this.store = null;
    }
    async init() {
      this.info("Zoom API start init");
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          var _a, _b, _c, _d;
          const socket = (_c = (_b = (_a = window[0].WCSockets) == null ? void 0 : _a.instance) == null ? void 0 : _b.RWG) == null ? void 0 : _c.socket;
          const store = (_d = window[0]) == null ? void 0 : _d.easyStore;
          if (socket && store) {
            clearInterval(interval);
            this.zoomWS = new ZoomWS(socket);
            this.store = store;
            this.info("Zoom API initialized");
            resolve();
          }
        }, 100);
      });
    }
    getMeetInfo() {
      var _a;
      this.info("Getting meet info");
      return ((_a = this.store) == null ? void 0 : _a.sessionStorageData) ?? null;
    }
    rename(newName) {
      var _a;
      this.info(`Rename to ${newName}`);
      const meetInfo = this.getMeetInfo();
      (_a = this.zoomWS) == null ? void 0 : _a.sendMessage({
        evt: 4109,
        seq: 12,
        body: {
          id: (meetInfo == null ? void 0 : meetInfo.userId) ?? 1,
          dn2: encodeToBase64(newName),
          olddn2: encodeToBase64(meetInfo == null ? void 0 : meetInfo.sessionUserName)
        }
      });
    }
    getUsers() {
      this.info("Get users");
      let largestUserArray = null;
      const visitedObjects = /* @__PURE__ */ new Set();
      function traverse(obj, depth) {
        if (depth > 40 || !obj || typeof obj !== "object" || visitedObjects.has(obj)) {
          return;
        }
        visitedObjects.add(obj);
        for (const key in obj) {
          try {
            const value = obj[key];
            if (Array.isArray(value) && value.length >= 2 && value[0] && typeof value[0].displayName === "string" && typeof value[0].userId !== "undefined") {
              if (!largestUserArray || value.length > largestUserArray.length) {
                largestUserArray = value;
              }
            } else if (value && typeof value === "object" && !(value instanceof Window) && !(value instanceof Node)) {
              traverse(value, depth + 1);
            }
          } catch {
          }
        }
      }
      traverse(window, 0);
      console.log(
        largestUserArray ? `users: ${largestUserArray.length}` : "no users found"
      );
      return largestUserArray;
    }
  }
  const zoomAPI = new ZoomAPI();
  await( zoomAPI.init());
  window.zoomAPI = zoomAPI;

})();