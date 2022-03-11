/// <reference types="node" />
import EventEmitter from "events";
import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType } from "../../types/chat";
declare class ChatMessages extends EventEmitter {
    private avatarEndpoint;
    private lastMessageTime;
    private config;
    ChatMessageEvents: ChatMessageEventsType;
    events: {
        SUBSCRIPTION: string;
        SYSTEM: string;
        FOLLOW: string;
        WELCOME: string;
        GIFT_SUB_RANDOM: string;
        GIFT_SUB: string;
        ACTIVITY: string;
        RADI: string;
        CUSTOM_SPELL: string;
        STREAM: string;
        UNFOLLOW: string;
    };
    constructor(chatServiceMessagesConfig?: ChatServiceMessagesConfig);
    handle(response: any): boolean;
    emitChatMessages(messages: ChatMessage[]): boolean;
    getNewMessages(messages: ChatMessage[]): ChatMessage[];
    updateTime(time?: number): number;
    fixAvatar(file: string): string;
}
export default ChatMessages;
