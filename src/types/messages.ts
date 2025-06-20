type Base64String = string

type Evt = 
  | 4109
  | 4135


type Message =
  | GenericZoomMessage<ConferenceRenameRequest>
  | GenericZoomMessage<ConferenceChatRequest>


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

interface ConferenceChatRequest {
  destNodeId: DestNodeId
  sn: string
  text: string
}

export default Message



