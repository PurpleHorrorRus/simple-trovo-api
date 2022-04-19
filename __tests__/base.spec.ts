import "dotenv/config";
import fs from "fs";

import { TrovoAPI } from "../src/index";
import ChatService from "../src/lib/modules/chat/service";
import { ChatMessage, ChatServiceConfig } from "../src/lib/interfaces/chat";
import ChatMessages from "../src/lib/modules/chat/messages";

jest.setTimeout(30 * 1000);

let Trovo: TrovoAPI;
let TrovoChat: ChatService;
let user_id: number;
let second_id: number;

const testingUsers = ["InfiniteHorror", "Wara"];

beforeAll(async () => {
    Trovo = new TrovoAPI({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        redirect_uri: "https://purplehorrorrus.github.io/token",
        credits: "credits.json"
    });

    let access_token: string = process.env.ACCESS_TOKEN! || "";
    let refresh_token: string = process.env.REFRESH_TOKEN! || "";

    if (!process.env.CI_TEST) {
        const fileContent: any = fs.readFileSync("./credits.json");
        const credits: any = JSON.parse(fileContent);
        access_token = credits.access_token;
        refresh_token = credits.refresh_token;
    }

    try {
        await Trovo.auth(access_token, refresh_token).catch(e => { 
            console.log(e);
        });

        const { users } = await Trovo.users.get(testingUsers);
        user_id = Number(users[0].user_id);
        second_id = Number(users[1].user_id);
    } catch (e) { 
        console.error(e);
    }
});

describe("Main", () => {
    test("Get Auth Link", () => {
        const link = Trovo.getAuthLink([], "code");
        expect(link).toBeTruthy();
    });

    test.skip("Exchange code", async () => {
        const result = await Trovo.exchange(process.env.CODE!);
        expect(result).toBeTruthy();
    });

    test.skip("Revoke Access Tokens", async () => {
        const result = await Trovo.revoke();
        expect(result).toBeTruthy();
    });
});

describe("Users", () => { 
    test("Get User", async () => {
        const user = await Trovo.users.getUserInfo();
        expect(user).toBeTruthy();
    });

    test("Get Users by ID", async () => { 
        const response = await Trovo.users.get(testingUsers);
        expect(response.users.length).toBeGreaterThan(0);
    });
});

describe("Categories", () => {
    test("Get Categories", async () => {
        const categories = await Trovo.categories.get();
        expect(categories.category_info.length).toBeGreaterThan(0);
    });

    test("Search Categories", async () => {
        const result = await Trovo.categories.search("League of Legends");
        expect(result).toBeTruthy();
    });
});

describe("Channels", () => {
    test("Get Channel", async () => {
        const channel = await Trovo.channels.get(user_id);
        expect(channel).toBeTruthy();
    });

    test("Top Channels", async () => {
        const top = await Trovo.channels.top();
        expect(top).toBeTruthy();
    });
});

describe("Channel", () => {
    test.skip("Edit Channel", async () => {
        const game = await Trovo.categories.search("League of Legends");
        const response = await Trovo.channel.edit(user_id, "Stream title changed with simple-trovo-api", game.category_info[0].id);
        expect(response.empty).toBe("");
    });

    test("Get Emotes", async () => {
        const emotes = await Trovo.channel.emotes(0, [user_id]);
        expect(emotes).toBeTruthy();
    });

    test("Get Followers", async () => {
        let result: any[] = [];

        let followers = await Trovo.channel.followers(second_id, 100);
        result = followers.follower;

        while (Number(followers.total) > result.length) {
            followers = await Trovo.channel.followers(second_id, 100, followers.cursor);
            result = result.concat(result, followers.follower);
        }

        expect(result).toBeTruthy();
    });

    test("Get Viewers", async () => {
        const channel = await Trovo.users.get(["Wara"]);
        const viewers = await Trovo.channel.viewers(channel.users[0].user_id);
        expect(viewers).toBeTruthy();
    });

    test("Get Subscriptions", async () => {
        const channel = await Trovo.users.get(["HerouTV"]);
        const subs = await Trovo.channel.subscribers(channel.users[0].user_id);
        expect(subs).toBeTruthy();
    });

    test("Get Stream M3U8 urls", async () => { // This request actually broken on Trovo
        const urls = await Trovo.channel.streamUrls(second_id);
        expect(urls).toBeTruthy();
    });
    
    test("Get Clips Info", async () => {
        const clips = await Trovo.channel.clips(second_id);
        expect(clips).toBeTruthy();
    });

    test("Get Past Streams", async () => {
        const streams = await Trovo.channel.pastStreams(second_id);
        expect(streams).toBeTruthy();
    });
});

describe("Chat", () => {
    const chatConfig: ChatServiceConfig = {
        messages: {
            fetchPastMessages: true
        }
    };
    
    beforeAll(async () => {
        TrovoChat = await Trovo.chat.connect(chatConfig);
        TrovoChat.on(TrovoChat.events.READY, () => {
            console.log("Chat has been connected");
        });
        
        TrovoChat.on(TrovoChat.events.DISCONNECTED, event => {
            console.log("Chat has been disconnected", event);
        });
    });

    test("Get Past Messages", async () => { 
        if (!chatConfig?.messages?.fetchPastMessages) {
            return expect(true).toBe(true);
        }

        const messages: ChatMessages[] = await new Promise(resolve => {
            TrovoChat.messages.once("past_messages", resolve);
        });

        expect(Array.isArray(messages)).toBe(true);
    });

    test("Receive message", async () => {
        const message: ChatMessage = await new Promise(resolve => {
            TrovoChat.messages.once(TrovoChat.messages.events.MESSAGE, resolve);
            Trovo.chat.send("Sended from simple-trovo-api");
        });

        Trovo.chat.delete(user_id, message.message_id, message.uid);
        expect(message).toBeTruthy();
    });

    test.skip("Receive messages sended at the same time", async () => {
        const messages: ChatMessage[] = [];
        
        await new Promise(resolve => {
            TrovoChat.messages.on("message", message => {
                messages.push(message);
                if (messages.length === 2) return resolve(messages);
            });
        });

        expect(messages.length).toBe(2);
        expect(messages[0].send_time).toBe(messages[1].send_time);
    });

    test.skip("Send Message", async () => {
        const message = await Trovo.chat.send("Sended from simple-trovo-api");
        expect(message).toBeTruthy();
    });

    test.skip("Stay alive", async () => {
        await new Promise(() => {
            TrovoChat.messages.on("message", message => {
                console.log(`${message.nick_name}: ${message.content}`);
            });
        });

        expect(true).toBe(true);
    });

    test.skip("Delete Message", async () => {
        await new Promise(resolve => {
            TrovoChat.messages.once("message", async message => { 
                await Trovo.chat.delete(user_id, message.message_id, message.uid);
                return resolve(true);
            });
    
            Trovo.chat.send("(To delete) Sended from simple-trovo-api, " + Date.now());
        });
    });
    
    test.skip("Perform Command", async () => {
        const response = await Trovo.chat.command("mods", user_id);
        expect(response).toBeTruthy();
    });
});