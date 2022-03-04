import "dotenv/config";

import TrovoAPI from "../src/trovo";

let Trovo: TrovoAPI;

beforeAll(async () => {
    Trovo = new TrovoAPI({
        client_id: process.env.CLIENT_ID!
    });
});

describe("Main", () => {
    test("Get Auth Link", () => {
        const link = Trovo.getAuthLink([], "http://localhost:1337");
        expect(link).toBeTruthy();
    });
});

describe("Chat", () => {
    test("Receive message", async () => { 
        const token: string = await Trovo.chat.token();
        await Trovo.chat.connect(token);
        
        const message = await new Promise(resolve => {
            Trovo.chat.events.on("message", resolve);
        });

        expect(message).toBeTruthy();
    })
});