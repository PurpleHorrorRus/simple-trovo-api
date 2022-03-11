/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "reconnecting-websocket";
import ChatMessages from "./messages";
import { ChatServiceConfig, WSMesageData } from "../../interfaces/chat";
import { WSHandler } from "../../types/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private heartbeatRate;
    private WebSocketParams;
    private requests;
    events: {
        CONNECTED: string;
        DISCONNECTED: string;
        READY: string;
        HEARTBEAT: string;
    };
    private handles;
    private nonces;
    connected: boolean;
    authorized: boolean;
    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    messages: ChatMessages;
    constructor(chatServiceConfig?: ChatServiceConfig);
    connect(token: string): WSHandler | Promise<WSHandler>;
    disconnect(error: string): boolean;
    send(type: string, nonce: string, data?: WSMesageData): void;
    messageHandler(message: any): Promise<WSHandler>;
    onAuth(): boolean;
}
export default ChatService;
