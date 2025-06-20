import { WEBSOCKET_EVENTS } from "@/config/constants";

type Base64String = string

type OutgoingEvents = typeof WEBSOCKET_EVENTS.OUTGOING;
type IncomingEvents = typeof WEBSOCKET_EVENTS.INCOMING;

export type Evt =
  | OutgoingEvents[keyof OutgoingEvents]
  | IncomingEvents[keyof IncomingEvents];


type Message =
  | GenericZoomMessage<ConferenceRenameRequest>
  | GenericZoomMessage<ConferenceChatRequest>
  | GenericZoomMessage<ConferenceEmojiRequest>
  | GenericZoomMessage<ConferenceHandRequest>
  | GenericZoomMessage<UserListUpdateBody>
  | GenericZoomMessage<ConferenceReaction>;


type DestNodeId = 0


interface GenericZoomMessage<T> {
  evt: Evt;
  seq: number;
  body: T
}

interface ConferenceRenameRequest {
  id: number
  dn2: Base64String;
  olddn2: Base64String;
}

interface ConferenceEmojiRequest {
  uNodeID: number;
  strEmojiContent: string;
}

interface ConferenceHandRequest {
  bOn: boolean;
  id: number;
}

export interface RawUser {
  id: number;
  dn2: string;
  bGuest: boolean;
  bRaiseHand: boolean;
}

export interface UserUpdate {
  id: number;
  dn2?: string;
  muted?: boolean;
  bVideoOn?: boolean;
  bRaiseHand?: boolean;
}

export interface UserListUpdateBody {
  add?: RawUser[];
  remove?: { id: number }[];
  update?: UserUpdate[];
}

interface ConferenceChatRequest {
  destNodeId: DestNodeId
  sn: string
  text: string
}

export interface ConferenceReaction {
  userID: number;
  strEmojiContent: string;
}

export default Message



