import "dotenv/config";

import { TrovoAPI } from "../src/index";
import ChatService from "../src/lib/modules/chat/service";
import { ChatMessage, ChatServiceConfig } from "../src/lib/interfaces/chat";

jest.setTimeout(60 * 1000 * 2);

let Trovo: TrovoAPI;
let TrovoChat: ChatService;
let user_id: number;
let second_id: number;

const chatConfig: ChatServiceConfig = {
    messages: {
        fetchPastMessages: false
    }
};

const testingUsers = ["InfiniteHorror", "Wara"];

beforeAll(async () => {
    Trovo = new TrovoAPI({
        client_id: process.env.CLIENT_ID!,
        access_token: process.env.ACCESS_TOKEN!
    });

    const { users } = await Trovo.users.get(testingUsers);
    user_id = Number(users[0].user_id);
    second_id = Number(users[1].user_id);

    TrovoChat = await Trovo.chat.connect(chatConfig);
    TrovoChat.on(TrovoChat.events.READY, () => {
        console.log("Chat has been connected");
    });
    
    TrovoChat.on(TrovoChat.events.DISCONNECTED, event => { 
        console.log("Chat has been disconnected", event);
    });
});

describe("Main", () => {
    test("Get Auth Link", () => {
        const link = Trovo.getAuthLink([], "https://purplehorrorrus.github.io/token");
        expect(link).toBeTruthy();
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

    test("Get Stream M3U8 urls", async () => {
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
    test.skip("Receive message", async () => {
        const message: ChatMessage = await new Promise(resolve => {
            TrovoChat.messages.on("message", resolve);

            if (!chatConfig.messages?.fetchPastMessages) {
                Trovo.chat.send("Sended from simple-trovo-api");
            }
        });

        if (!chatConfig.messages?.fetchPastMessages) {
            Trovo.chat.delete(user_id, message.message_id, message.uid);
        }

        expect(message).toBeTruthy();
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