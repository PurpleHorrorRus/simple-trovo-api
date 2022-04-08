"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class ChatMessages extends events_1.default {
    constructor(chatServiceMessagesConfig = {}) {
        super();
        this.avatarEndpoint = "https://headicon.trovo.live";
        this.ChatMessageEvents = {
            5: "spells",
            6: "super_cap",
            7: "colorful",
            8: "spell",
            9: "bullet_screen",
            5001: "subscription",
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
        this.events = {
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
        this.time = Math.floor(Date.now() / 1000);
        this.pastMessagesFetched = false;
        this.config = chatServiceMessagesConfig;
    }
    handle(response) {
        let messages = response.data.chats;
        if (!messages)
            return false;
        if (this.config.fetchPastMessages && !this.pastMessagesFetched) {
            this.pastMessagesFetched = true;
            return this.emitPastMessages(messages);
        }
        messages = this.getNewMessages(messages);
        if (messages.length > 0) {
            messages.forEach((message) => {
                this.time = message.send_time;
                return this.emitChatMessage(message);
            });
            return true;
        }
        return false;
    }
    getNewMessages(messages) {
        return messages.filter((message) => {
            return message.send_time >= this.time;
        });
    }
    formatMessage(message) {
        message.avatar = this.fixAvatar(message.avatar);
        if (message.type !== 0) {
            try {
                message.content = JSON.parse(message.content);
            }
            catch (_) {
                null;
            }
        }
        return message;
    }
    emitChatMessage(message) {
        message = this.formatMessage(message);
        const event = this.ChatMessageEvents[message.type] || this.events.MESSAGE;
        return this.emit(event, message);
    }
    emitPastMessages(messages) {
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
    fixAvatar(file) {
        if (!file) {
            return "";
        }
        return !~file?.indexOf(this.avatarEndpoint)
            ? `${this.avatarEndpoint}/user/${file}`
            : file;
    }
}
exports.default = ChatMessages;
