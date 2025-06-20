import Logger from "@/utils/logger";

const logger = new Logger('Utils');

export const encodeToBase64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (e) {
    logger.error("Failed to encode to Base64:", e);
    return "";
  }
};

export const decodeFromBase64 = (str: string): string => {
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    logger.error("Failed to decode from Base64:", e);
    return "";
  }
};

export function randomString(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}