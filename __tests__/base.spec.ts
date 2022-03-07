import "dotenv/config";

import { TrovoAPI } from "../src/index";

jest.setTimeout(60 * 1000 * 2);

let Trovo: TrovoAPI;
let user_id: number;
let second_id: number;

const testingUsers = ["InfiniteHorror", "Wara"];

beforeAll(async () => {
    Trovo = new TrovoAPI({
        client_id: process.env.CLIENT_ID!,
        access_token: process.env.ACCESS_TOKEN!
    });

    const { users } = await Trovo.users.get(testingUsers);
    user_id = Number(users[0].user_id);
    second_id = Number(users[1].user_id);

    const chatToken = await Trovo.chat.token();
    await new Promise(resolve => {
        Trovo.chat.service.once("connected", () => { 
            console.log("Chat has been connected");
            return resolve(true);
        });
    
        Trovo.chat.service.connect(chatToken);
    });
});

describe("Main", () => {
    // test("Get Auth Link", () => {
    //     const link = Trovo.getAuthLink([], "https://purplehorrorrus.github.io/token");
    //     expect(link).toBeTruthy();
    // });
});

describe("Users", () => { 
    // test("Get User", async () => {
    //     const user = await Trovo.users.getUserInfo();
    //     expect(user).toBeTruthy();
    // });

    // test("Get Users by ID", async () => { 
    //     const response = await Trovo.users.get(testingUsers);
    //     expect(response.users.length).toBeGreaterThan(0);
    // });
});

describe("Categories", () => {
    // test("Get Categories", async () => {
    //     const categories = await Trovo.categories.get();
    //     expect(categories.category_info.length).toBeGreaterThan(0);
    // });

    // test("Search Categories", async () => {
    //     const result = await Trovo.categories.search("League of Legends");
    //     expect(result).toBeTruthy();
    // });
});

describe("Channels", () => {
    // test("Get Channel", async () => {
    //     const channel = await Trovo.channels.get("Dreissig");
    //     expect(channel).toBeTruthy();
    // });

    // test("Top Channels", async () => {
    //     const top = await Trovo.channels.top();
    //     expect(top).toBeTruthy();
    // });
});

describe("Channel", () => {
    // test("Edit Channel", async () => {
    //     const game = await Trovo.categories.search("League of Legends");
    //     const response = await Trovo.channel.edit(user_id, "Stream title changed with simple-trovo-api", game.category_info[0].id);
    //     expect(response.empty).toBe("");
    // });

    // test("Get Emotes", async () => {
    //     const emotes = await Trovo.channel.emotes(0, [user_id]);
    //     expect(emotes).toBeTruthy();
    // });

    // test("Get Followers", async () => {
    //     const followers = await Trovo.channel.followers(second_id);
    //     expect(followers).toBeTruthy();
    // });

    // test("Get Viewers", async () => {
    //     const channel = await Trovo.users.get(["Wara"]);
    //     const viewers = await Trovo.channel.viewers(channel.users[0].user_id);
    //     expect(viewers).toBeTruthy();
    // });

    // test("Get Subscriptions", async () => {
    //     const channel = await Trovo.users.get(["HerouTV"]);
    //     const subs = await Trovo.channel.subscribers(channel.users[0].user_id);
    //     expect(subs).toBeTruthy();
    // });

    // test("Get Stream M3U8 urls", async () => {
    //     const urls = await Trovo.channel.streamUrls(second_id);
    //     expect(urls).toBeTruthy();
    // });
    
    // test("Get Clips Info", async () => {
    //     const clips = await Trovo.channel.clips(second_id);
    //     expect(clips).toBeTruthy();
    // });

    // test("Get Past Streams", async () => {
    //     const streams = await Trovo.channel.pastStreams(second_id);
    //     expect(streams).toBeTruthy();
    // });
});

describe("Chat", () => {
    // test("Get Token", async () => {
    //     const token = await Trovo.chat.token();
    //     expect(token).toBeTruthy();
    // });
    
    // test("Send Message", async () => {
    //     const message = await Trovo.chat.send("Sended from simple-trovo-api");
    //     expect(message).toBeTruthy();
    // });

    // test("Receive message", async () => {
    //     const message = await new Promise(resolve => {
    //         Trovo.chat.service.on("message", resolve);
    //     });

    //     expect(message).toBeTruthy();
    // });

    // test("Stay alive", async () => {
    //     await new Promise(() => {
    //         Trovo.chat.service.on("message", message => {
    //             console.log(`${message.nick_name}: ${message.content}`);
    //         });
    //     });
    // });

    // test("Delete Message", async () => {
    //     await new Promise(resolve => {
    //         Trovo.chat.service.once("message", async message => { 
    //             await Trovo.chat.delete(user_id, message.message_id, message.uid);
    //             return resolve(true);
    //         });
    
    //         Trovo.chat.send("(To delete) Sended from simple-trovo-api, " + Date.now());
    //     });
    // });
});