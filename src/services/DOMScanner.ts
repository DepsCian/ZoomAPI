import { EasyStore, User, ZoomSocketInstance } from "@/types/types";
import { CONFIG } from "@/config/constants";

export function findGlobal<T>(check: (obj: any) => T | undefined): T | null {
  const queue: any[] = [window.top];
  const visited = new Set<any>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);

    try {
      let result = check(current);
      if (result) return result;

      for (const key of Object.keys(current)) {
        const prop = current[key];
        if (prop && typeof prop === "object") {
          if (!visited.has(prop)) {
            result = check(prop);
            if (result) return result;

            if (prop.window === prop) {
              queue.push(prop);
            }
          }
        }
      }

      if (current.frames) {
        for (let i = 0; i < current.frames.length; i++) {
          queue.push(current.frames[i]);
        }
      }
    } catch (e) {
      // Ignore cross-origin or other access errors
    }
  }

  return null;
}

export function findSocketInstance(): ZoomSocketInstance | null {
  return findGlobal(obj =>
    obj?.WCSockets?.instance?.RWG?.send ? (obj.WCSockets.instance as ZoomSocketInstance) : undefined
  );
}

export function findStore(): EasyStore | null {
  return findGlobal<EasyStore>(obj =>
    typeof obj?.easyStore?.sessionStorageData?.sessionUserName === "string" ? obj.easyStore : undefined
  );
}