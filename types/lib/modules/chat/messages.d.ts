/// <reference types="node" />
import EventEmitter from "events";
import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType, ChatSpecialEventType } from "../../types/chat";
declare class ChatMessages extends EventEmitter {
    private avatarEndpoint;
    private lastMessageTime;
    private config;
    ChatMessageEvents: ChatMessageEventsType;
    events: ChatSpecialEventType;
    constructor(chatServiceMessagesConfig?: ChatServiceMessagesConfig);
    handle(response: any): boolean;
    formatMessage(message: ChatMessage): ChatMessage;
    emitChatMessages(messages: ChatMessage[]): boolean;
    getNewMessages(messages: ChatMessage[]): ChatMessage[];
    updateLastMessageTime(messages: ChatMessage[]): number;
    updateTime(time?: number): number;
    fixAvatar(file: string | undefined): string;
}
export default ChatMessages;
