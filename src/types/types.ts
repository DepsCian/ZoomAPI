interface EasyStoreData {
  sessionUserName: string;
  userId: number;
  userEmail: string;
  meetingInfo: MeetingInfo;
}

interface MeetingInfo {
  meetingId: number;
  pwd: string;
}

interface EasyStore {
  sessionStorageData: EasyStoreData;
}

interface User {
  displayName: string;
  userId: unknown;
  [key: string]: any;
}

export type { EasyStore, EasyStoreData, MeetingInfo, User };
