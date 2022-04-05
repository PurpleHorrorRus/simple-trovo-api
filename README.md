## Simple Trovo API

An open-source package that allows easy to integrate your applications with Trovo API. All requests matching to the [docs](https://developer.trovo.live/docs/APIs.html#_1-introduction). This package supports TypeScript.

## Usage

Before using this package you must register your application in Trovo Developer Portal, wait several days and receive Client ID of your application. If you already have, you can use this package.

List of available modules:
```bash
categories, channel, channels, chat, chat.service, users
```

## Implict Flow


### Fetch personal access token

If you already have access token, you can skip this step.

You must to fetch your personal token with generated with specified scopes and specified redirect url in page with your application. OAuth Implict Flow stores your access token only 10 days.

```javascript
const { TrovoAPI } = require("simple-trovo-api");

const Trovo = new TrovoAPI({
    client_id: "xxxxxxxxx",
    client_secret: "xxxxxxxx",
    redirect_uri: "http://localhost:1337/"
});

const scopes = [];
const url = Trovo.getAuthLink(scopes, "token");
console.log(url);
```

### Create new instance with Implict Flow

Now you can use this package at full power. Here is example of usage (fetch information about yourself):

```javascript
const { TrovoAPI } = require("simple-trovo-api");

(async () => {
    const Trovo = new TrovoAPI({
        client_id: "xxxxxxxxx",
        client_secret: "xxxxxxxx",
        redirect_uri: "http://localhost:1337/"
    });

    await Trovo.auth(access_token);
    const user = await Trovo.users.getUserInfo();
    console.log(user);
})();
```

## Code Flow

OAuth code flow works a little harder, but you don't need to manually update your tokens in future. Access token and refresh token will be refresh automatically until refresh token is valid. One refresh token storing for only 30 days.

### Authorization

```javascript
const { TrovoAPI } = require("simple-trovo-api");

const Trovo = new TrovoAPI({
    client_id: "xxxxxxxxx",
    client_secret: "xxxxxxxx",
    redirect_uri: "http://localhost:1337/",
    credits: "credits.json"
});

const scopes = [];
const url = Trovo.getAuthLink(scopes, "code");
console.log(url);

/*
After you enter your login and password on Trovo login page, 
you must to exchange received code to access token and refresh token.
*/

await Trovo.exchange(code);
```


### Create new instance with Code Flow

There is same example.

```javascript
const { TrovoAPI } = require("simple-trovo-api");

(async () => {
    const Trovo = new TrovoAPI({
        client_id: "xxxxxxxxx",
        client_secret: "xxxxxxxx",
        redirect_uri: "http://localhost:1337/",
        credits: "credits.json"
    });

    await Trovo.auth();
    const user = await Trovo.users.getUserInfo();
    console.log(user);
})();
```

## Chat

Trovo uses simple WebSocket connection to receive messages from your chat and simple-trovo-api realize some events to interact with. Before using chat service you must to refresh chat token on every connecting or reconnecting.

You can to specify config for chat service.

### ChatServiceConfig
| Name | Required | Type | Description |
| :--- | :---: | :---: | :--- |
| user_id | false | number | ID of channel you want to connect. Script will fetch chat token of specified channel or your chat token by default if is not specified |
| messages.fetchPastMessages | false | boolean | Receive all past messages on connection |

Example:

```javascript
const TrovoChat = await Trovo.chat.connect(chatServiceConfig?);

TrovoChat.on(TrovoChat.events.READY, () => {
    console.log("Trovo chat has been connected");

    // Listen regular chat messages
    TrovoChat.messages.on(TrovoChat.messages.events.MESSAGE, message => {
        console.log(message);
    });

    // Emitting only if you specified messages.fetchPastMessages to true
    TrovoChat.messages.once(TrovoChat.messages.events.PAST_MESSAGES, messages => {
        console.log(`There is ${messages.length} of old messages`);
    });

    /*
        Listen special events
        Special event examples: follow, unfollow, spells
    */

    TrovoChat.messages.on(TrovoChat.messages.events.SPELLS, message => {
        const user = message.nick_name;
        const spell = message.content.gift;
        const count = message.content.num;
        const cost = message.content.gift_value;
        const value = message.content.value_type;

        console.log(`${user} uses ${count}x${spell} for ${cost} ${value}!`);
    });

    TrovoChat.messages.on(TrovoChat.messages.events.FOLLOW, follow => {
        console.log(`Thank you for following, ${follow.nick_name}!`);
    });
});

TrovoChat.on(TrovoChat.events.DISCONNECTED, reason => {
    console.error("Trovo chat has been disconnected", reason);
});
```

Chat service has an listeners for special events in chat. There is a list of events.

```
spells, super_cap, colorful, spell, bullet_screen, subscription, system, follow, welcome, gift_sub_random, gift_sub, activity, raid, custom_spell, stream, unfollow
```