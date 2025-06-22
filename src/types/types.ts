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
  userId: number;
  displayName: string;
  isGuest: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
}

export interface ZoomSocketInstance {
  RWG?: {
    socket: WebSocket;
  };
}

export type { EasyStore, EasyStoreData, MeetingInfo, User };
