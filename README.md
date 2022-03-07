## Simple Trovo API

An open-source package that allows to integrate your applications with Trovo API. All requests matching to the [docs](https://developer.trovo.live/docs/APIs.html#_1-introduction). This package supports TypeScript.

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
const TrovoAPI = require("simple-trovo-api");

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
const TrovoAPI = require("simple-trovo-api");

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

Trovo uses simple WebSocket connection to receive messages from your chat and simple-trovo-api realize some events to interact with. Before using chat service you must to refresh chat token every time. 

Example:

```javascript
Trovo.chat.service.once("connected", () => {

    // Listen messages
    Trovo.chat.service.on("message", message => {
        console.log(message);
    });
});

const token = await Trovo.chat.token();
Trovo.chat.service.connect(token);
```