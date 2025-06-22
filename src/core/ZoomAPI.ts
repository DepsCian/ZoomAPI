import { encodeToBase64 } from "@/utils";
import WebSocketService from "@/services/WebSocketService";
import { EasyStore, EasyStoreData, User } from "@/types/types";
import Logger from "@/utils/logger";
import { WEBSOCKET_EVENTS, CONFIG } from "@/config/constants";
import { findSocketInstance, findStore } from "@/services/DOMScanner";
import Message, { Evt } from "@/types/messages";
import { EventHandlerService } from "@/services/EventHandlerService";
import { LogLevel } from "@/utils/logger";

class ZoomAPI {
  private readonly logger: Logger;
  private seq: number;
  WSService: WebSocketService | null;
  store: EasyStore | null;
  private userPool: Map<number, User>;
  private eventHandler: EventHandlerService;

  constructor(logLevel: LogLevel = 'info') {
    this.logger = new Logger('ZoomAPI', logLevel);
    this.seq = 0;
    this.WSService = null;
    this.store = null;
    this.userPool = new Map();
    this.eventHandler = new EventHandlerService(this.userPool, this.logger);
  }

  private _assertInitialized(): asserts this is { WSService: WebSocketService; store: EasyStore } {
    if (!this.WSService || !this.store) {
      throw new Error("ZoomAPI is not initialized.");
    }
  }

  private _handleWebSocketMessage(message: Message): void {
    this.eventHandler.handleMessage(message);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing: waiting for Zoom client components...");

    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        if (Date.now() - startTime > CONFIG.INIT_TIMEOUT) {
          clearInterval(interval);
          const errorMsg = "Initialization timed out. Could not find Zoom client components.";
          this.logger.error(errorMsg);
          return reject(new Error(errorMsg));
        }
        
        const socketInstance = findSocketInstance();
        const store = findStore();
        const socket = socketInstance?.RWG?.socket;

        if (socket && store) {
          clearInterval(interval);
          this.WSService = new WebSocketService(socket, this._handleWebSocketMessage.bind(this));
          this.store = store;
          this.logger.info("Initialization successful.");
          resolve();
        }
      }, CONFIG.INIT_INTERVAL);
    });
  }

  private _sendMessage(evt: Evt, body: any): void {
    this._assertInitialized();
    this.seq++;
    this.WSService.sendMessage({
      evt,
      seq: this.seq,
      body,
    });
  }

  getConferenceDetails(): EasyStoreData {
    this._assertInitialized();
    this.logger.debug("Getting meet info");
    return this.store.sessionStorageData;
  }

  sendSelfRename(newName: string): void {
    this.logger.info(`Renaming to "${newName}"`);
    const conferenceDetails = this.getConferenceDetails();
    
    this._sendMessage(WEBSOCKET_EVENTS.OUTGOING.SELF_RENAME, {
      id: conferenceDetails.userId,
      dn2: encodeToBase64(newName),
      olddn2: encodeToBase64(conferenceDetails.sessionUserName),
    });
  }

  sendReaction(emoji: string): void {
    this.logger.info(`Sending reaction: "${emoji}"`);
    const conferenceDetails = this.getConferenceDetails();
    
    this._sendMessage(WEBSOCKET_EVENTS.OUTGOING.REACTION, {
      uNodeID: conferenceDetails.userId,
      strEmojiContent: emoji,
    });
  }

  setHandState(isRaised: boolean): void {
    this.logger.info(`Setting hand state to: ${isRaised}`);
    const conferenceDetails = this.getConferenceDetails();
    
    this._sendMessage(WEBSOCKET_EVENTS.OUTGOING.HAND_STATE, {
      bOn: isRaised,
      id: conferenceDetails.userId,
    });
  }

  getUsers(): User[] {
    this._assertInitialized();
    this.logger.debug("Getting users from the local pool.");
    return Array.from(this.userPool.values());
  }
}

export default ZoomAPI;
