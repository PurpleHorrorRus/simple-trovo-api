import "dotenv/config";

import TrovoAPI from "../src/trovo";

let Trovo: TrovoAPI;
let user_id: number;
let second_id: number

beforeAll(async () => {
    Trovo = new TrovoAPI({
        client_id: process.env.CLIENT_ID!,
        access_token: process.env.ACCESS_TOKEN!
    });

    const { users } = await Trovo.users.get(["InfiniteHorror", "Wara"]);
    user_id = users[0].user_id;
    second_id = users[1].user_id;
});

// describe("Main", () => {
//     test("Get Auth Link", () => {
//         const link = Trovo.getAuthLink([], "https://purplehorrorrus.github.io/token");
//         expect(link).toBeTruthy();
//     });
// });

// describe("Users", () => { 
    // test("Get User", async () => {
    //     const user = await Trovo.users.getUserInfo();
    //     expect(user).toBeTruthy();
    // });

    // test("Get Users by ID", async () => { 
    //     const users = ["InfiniteHorror", "HerouTV"];
    //     const response = await Trovo.users.get(users);
    //     expect(response.length).toBeGreaterThan(0);
    // });
// });

// describe("Categories", () => {
    // test("Get Categories", async () => {
    //     const categories = await Trovo.categories.get();
    //     expect(categories.length).toBeGreaterThan(0);
    // });

    // test("Search Categories", async () => {
    //     const result = await Trovo.categories.search("League of");
    //     expect(result).toBeTruthy();
    // });
// });

// describe("Channels", () => {
    // test("Get Channel", async () => {
    //     const channel = await Trovo.channels.get("HerouTV");
    //     expect(channel).toBeTruthy();
    // });

    // test("Top Channels", async () => {
    //     const top = await Trovo.channels.top();
    //     expect(top).toBeTruthy();
    // });
// });

// describe("Channel", () => {
    // test("Edit Channel", async () => {
    //     const channel = await Trovo.users.get(["InfiniteHorror"]);
    //     const response = await Trovo.channel.edit(channel.users[0].user_id);
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
// });

// describe("Chat", () => {
//     test("Receive message", async () => {
//         const token: string = await Trovo.chat.token();
//         await Trovo.chat.connect(token);
        
//         const message = await new Promise(resolve => {
//             Trovo.chat.events.on("message", resolve);
//         });

//         expect(message).toBeTruthy();
//     });
// });