import EventEmitter from "events";

import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType } from "../../types/chat";

class ChatMessages extends EventEmitter { 
    private avatarEndpoint: string = "https://headicon.trovo.live/user";
    private lastMessageTime: number = 0;

    private config: ChatServiceMessagesConfig;

    public ChatMessageEvents: ChatMessageEventsType = {
        5001: "subscribption",
        5002: "system",
        5003: "follow",
        5004: "welcome",
        5005: "gift_sub_random",
        5006: "gift_sub",
        5007: "activity",
        5008: "raid",
        5009: "custom_spell",
        5012: "stream",
        5013: "unfollow"
    };

    public events = {
        MESSAGE: this.ChatMessageEvents[0],
        SUBSCRIPTION: this.ChatMessageEvents[5001],
        SYSTEM: this.ChatMessageEvents[5002],
        FOLLOW: this.ChatMessageEvents[5003],
        WELCOME: this.ChatMessageEvents[5004],
        GIFT_SUB_RANDOM: this.ChatMessageEvents[5005],
        GIFT_SUB: this.ChatMessageEvents[5006],
        ACTIVITY: this.ChatMessageEvents[5007],
        RADI: this.ChatMessageEvents[5008],
        CUSTOM_SPELL: this.ChatMessageEvents[5009],
        STREAM: this.ChatMessageEvents[5012],
        UNFOLLOW: this.ChatMessageEvents[5013],
    };

    constructor(chatServiceMessagesConfig: ChatServiceMessagesConfig = {}) {
        super();

        this.config = chatServiceMessagesConfig;
    }

    handle(response: any): boolean {
        if (!response.data.chats) {
            return this.emitChatMessages([]);
        }

        if (this.config.fetchPastMessages && this.lastMessageTime === 0) {
            return this.emitChatMessages(response.data.chats);
        }

        const newMessages: ChatMessage[] = this.getNewMessages(response.data.chats);
        return this.emitChatMessages(newMessages);
    }

    emitChatMessages(messages: ChatMessage[]): boolean {
        if (messages.length > 0) {
            messages.forEach((message: ChatMessage) => {
                message.avatar = this.fixAvatar(message.avatar);
                const event: string = this.ChatMessageEvents[message.type] || "message";
                return this.emit(event, message);
            });
        }

        const time: number = messages.length > 0 ? messages[messages.length - 1].send_time : Date.now();
        this.updateTime(time);

        return messages.length > 0;
    }

    getNewMessages(messages: ChatMessage[]): ChatMessage[] { 
        const newMessages: ChatMessage[] = messages.filter((message: ChatMessage) => {
            return message.send_time > this.lastMessageTime;
        });
        
        return newMessages;
    }

    updateTime(time = Date.now()): number {
        this.lastMessageTime = Number(time.toString().substring(0, 10));
        return this.lastMessageTime;
    }

    fixAvatar(file: string): string {
        return !~file.indexOf(this.avatarEndpoint)
            ? `${this.avatarEndpoint}/${file}`
            : file;
    }
}

export default ChatMessages;