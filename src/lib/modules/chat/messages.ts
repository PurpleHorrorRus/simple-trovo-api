import EventEmitter from "events";

import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType, ChatSpecialEventType, EventType } from "../../types/chat";

class ChatMessages extends EventEmitter { 
    private avatarEndpoint: string = "https://headicon.trovo.live";
    private config: ChatServiceMessagesConfig;

    public ChatMessageEvents: ChatMessageEventsType = {
        5: "spells",
        6: "super_cap",
        7: "colorful",
        8: "spell",
        9: "bullet_screen",
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

    public events: ChatSpecialEventType = {
        MESSAGE: "message",
        PAST_MESSAGES: "past_messages",
        SPELLS: this.ChatMessageEvents[5],
        SUPER_CAP: this.ChatMessageEvents[6],
        COLORFUL: this.ChatMessageEvents[7],
        SPELL: this.ChatMessageEvents[8],
        BULLET_SCREEN: this.ChatMessageEvents[9],
        SUBSCRIPTION: this.ChatMessageEvents[5001],
        SYSTEM: this.ChatMessageEvents[5002],
        FOLLOW: this.ChatMessageEvents[5003],
        WELCOME: this.ChatMessageEvents[5004],
        GIFT_SUB_RANDOM: this.ChatMessageEvents[5005],
        GIFT_SUB: this.ChatMessageEvents[5006],
        ACTIVITY: this.ChatMessageEvents[5007],
        RAID: this.ChatMessageEvents[5008],
        CUSTOM_SPELL: this.ChatMessageEvents[5009],
        STREAM: this.ChatMessageEvents[5012],
        UNFOLLOW: this.ChatMessageEvents[5013],
    };

    private time: number = Math.floor(Date.now() / 1000);
    private pastMessagesFetched: boolean = false;

    constructor(chatServiceMessagesConfig: ChatServiceMessagesConfig = {}) {
        super();

        this.config = chatServiceMessagesConfig;
    }

    handle(response: any): boolean {
        let messages: ChatMessage[] = response.data.chats;

        if (this.config.fetchPastMessages && !this.pastMessagesFetched) {
            this.pastMessagesFetched = true;
            return this.emitPastMessages(messages);
        }

        messages = this.getNewMessages(messages);
        if (messages.length > 0) {
            messages.forEach((message: ChatMessage) => {
                this.time = message.send_time;
                return this.emitChatMessage(message);
            });
            
            return true;
        }

        return false;
    }

    getNewMessages(messages: ChatMessage[]): ChatMessage[] {
        return messages.filter((message: ChatMessage) => {
            return message.send_time >= this.time;
        });
    }

    formatMessage(message: ChatMessage): ChatMessage { 
        message.avatar = this.fixAvatar(message.avatar);

        if (message.type !== 0) {
            try { message.content = JSON.parse(message.content); }
            catch (_) { null; }
        }

        return message;
    }

    emitChatMessage(message: ChatMessage): boolean {
        message = this.formatMessage(message);
        const event: EventType = this.ChatMessageEvents[message.type] || this.events.MESSAGE;
        return this.emit(event, message);
    }

    emitPastMessages(messages: ChatMessage[]): boolean { 
        if (messages.length > 0) {
            const currentTime = Math.floor(Date.now() / 1000);

            messages = messages.filter(message => { 
                return message.send_time < currentTime;
            });
            
            messages = messages.map(message => {
                return this.formatMessage(message);
            });

            return this.emit(this.events.PAST_MESSAGES, messages);
        }

        return false;
    }

    fixAvatar(file: string | undefined): string {
        if (!file) { 
            return "";
        }

        return !~file?.indexOf(this.avatarEndpoint)
            ? `${this.avatarEndpoint}/user/${file}`
            : file;
    }
}

export default ChatMessages;