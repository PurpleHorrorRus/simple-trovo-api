/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "ws";
import { WSMesageData } from "../../interfaces/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private connected;
    private heartbeatRate;
    private nonces;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    private lastMessageTime;
    constructor();
    connect(token: string): Promise<boolean | void>;
    disconnect(error: Error | WebSocket.ErrorEvent | unknown): void;
    send(type: string, nonce: string, data?: WSMesageData): boolean;
    messageHandler(message: any): any;
}
export default ChatService;
