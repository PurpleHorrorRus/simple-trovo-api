/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "ws";
import { WSMesageData } from "../../interfaces/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private heartbeatRate;
    private nonces;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    private lastMessageTime;
    constructor();
    connect(token: string): Promise<boolean | void>;
    send(type: string, nonce: string, data?: WSMesageData): boolean;
    messageHandler(message: any): any;
}
export default ChatService;