function encodeToBase64(str: string | undefined): string {
  if (str === null || str === undefined) {
    return "";
  }

  const uint8Array = new TextEncoder().encode(str);
  let binary = "";
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}


function randomString(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export {
  encodeToBase64,
  randomString
}