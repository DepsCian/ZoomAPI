import { decodeFromBase64 } from "@/utils";
import Logger from "@/utils/logger";
import { User } from "@/types/types";
import Message, { RawUser, UserUpdate, UserListUpdateBody, ConferenceReaction } from "@/types/messages";
import { WEBSOCKET_EVENTS } from "@/config/constants";

export class EventHandlerService {
  private userPool: Map<number, User>;
  private logger: Logger;

  constructor(userPool: Map<number, User>, logger: Logger) {
    this.userPool = userPool;
    this.logger = logger;
  }

  public handleMessage(message: Message): void {
    switch (message.evt) {
      case WEBSOCKET_EVENTS.INCOMING.USER_LIST_UPDATE: {
        const body = message.body as UserListUpdateBody;
        this.handleUserAdd(body.add);
        this.handleUserRemove(body.remove);
        this.handleUserUpdate(body.update);
        break;
      }
      case WEBSOCKET_EVENTS.INCOMING.REACTION: {
        const body = message.body as ConferenceReaction;
        this.logger.debug(`User ${body.userID} sent reaction: ${body.strEmojiContent}`);
        break;
      }
      default:
        this.logger.debug(`Unhandled event received:`, message);
        break;
    }
  }

  private handleUserAdd(users?: RawUser[]): void {
    users?.forEach(rawUser => {
      const user: User = {
        userId: rawUser.id,
        displayName: decodeFromBase64(rawUser.dn2),
        isGuest: rawUser.bGuest,
        isHandRaised: rawUser.bRaiseHand,
        isMuted: true,
        isVideoOn: false,
      };
      this.userPool.set(user.userId, user);
      this.logger.debug(`User added:`, user);
    });
  }

  private handleUserRemove(users?: { id: number }[]): void {
    users?.forEach(userToRemove => {
      if (this.userPool.has(userToRemove.id)) {
        const removedUser = this.userPool.get(userToRemove.id);
        this.userPool.delete(userToRemove.id);
        this.logger.debug(`User removed:`, removedUser);
      }
    });
  }

  private handleUserUpdate(users?: UserUpdate[]): void {
    users?.forEach(updateData => {
      const user = this.userPool.get(updateData.id);
      if (user) {
        if (typeof updateData.dn2 === 'string') user.displayName = decodeFromBase64(updateData.dn2);
        if (typeof updateData.muted === 'boolean') user.isMuted = updateData.muted;
        if (typeof updateData.bVideoOn === 'boolean') user.isVideoOn = updateData.bVideoOn;
        if (typeof updateData.bRaiseHand === 'boolean') user.isHandRaised = updateData.bRaiseHand;
        this.logger.debug(`User updated:`, user);
      }
    });
  }
} 