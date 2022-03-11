## Simple Trovo API

An open-source package that allows easy to integrate your applications with Trovo API. All requests matching to the [docs](https://developer.trovo.live/docs/APIs.html#_1-introduction). This package supports TypeScript.

## Usage

Before using this package you must register your application in Trovo Developer Portal, wait several days and receive Client ID of your application. If you already have, you can use this package.

List of available modules:
```bash
categories, channel, channels, chat, chat.service, users
```

### Fetch personal access token

If you already have access token, you can skip this step.

You must to fetch your personal token with generated with specified scopes and specified redirect url in page with your application.

```javascript
const { TrovoAPI } = require("simple-trovo-api");

const Trovo = new TrovoAPI({
    client_id: "xxxxxxxxx"
});

const scopes = []; // Leave it empty to grant access with all available scopes
const url = Trovo.getAuthLink(scopes, "https://purplehorrorrus.github.io/token");
console.log(url);
```

### Create new instance with access token

Now you can use this package at full power. Here is example (fetch information about yourself):

```javascript
const { TrovoAPI } = require("simple-trovo-api");

(async () => {
    const Trovo = new TrovoAPI({
        access_token: "xxxxxxxxx",
        client_id: "xxxxxxxxx"
    });

    const user = await Trovo.users.getUserInfo();
    console.log(user);
})();
```

### Chat connection

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

    // Listen chat messages (regular messages and magic chat)
    TrovoChat.messages.on("message", message => {
        console.log(message);
    });

    // Listen special message events
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
subscription, system, follow, welcome, gift_sub_random, gift_sub, activity, raid, custom_spell, stream, unfollow
```

All messages of magic chat mark as default messages and not included to the special events.