import { encodeToBase64 } from "./utils";
import ZoomWS from "./zoomWS";
import { EasyStore, EasyStoreData, User } from "./types";
import Logger from "./logger";


class ZoomAPI extends Logger {
  zoomWS: ZoomWS | null;
  store: EasyStore | null;

  constructor() {
    super()
    this.zoomWS = null;
    this.store = null;
  }

  async init(): Promise<void> {
    this.info("Zoom API start init")

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const socket = window[0].WCSockets?.instance?.RWG?.socket;
        const store = window[0]?.easyStore;

        if (socket && store) {
          clearInterval(interval);
          this.zoomWS = new ZoomWS(socket);
          this.store = store;
          this.info("Zoom API initialized")
          resolve();
        }
      }, 100);
    });
  }

  getMeetInfo(): EasyStoreData | null {
    this.info("Getting meet info")
    return this.store?.sessionStorageData ?? null;
  }

  rename(newName: string): void {
    this.info(`Rename to ${newName}`)
    const meetInfo = this.getMeetInfo();

    this.zoomWS?.sendMessage({
      evt: 4109,
      seq: 12,
      body: {
        id: meetInfo?.userId ?? 1,
        dn2: encodeToBase64(newName),
        olddn2: encodeToBase64(meetInfo?.sessionUserName),
      },
    });
  }

  
  getUsers(): User[] | null {
    this.info("Get users")
    let largestUserArray: User[] | null = null;
    const visitedObjects = new Set<object>();

    function traverse(obj: unknown, depth: number): void {
      if (
        depth > 40 ||
        !obj ||
        typeof obj !== "object" ||
        visitedObjects.has(obj as object)
      ) {
        return;
      }
      visitedObjects.add(obj as object);

      for (const key in obj as object) {
        try {
          const value = (obj as any)[key];
          if (
            Array.isArray(value) &&
            value.length >= 2 &&
            value[0] &&
            typeof (value[0] as User).displayName === "string" &&
            typeof (value[0] as User).userId !== "undefined"
          ) {
            if (!largestUserArray || value.length > largestUserArray.length) {
              largestUserArray = value as User[];
            }
          } else if (
            value &&
            typeof value === "object" &&
            !(value instanceof Window) &&
            !(value instanceof Node)
          ) {
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

export default ZoomAPI;
