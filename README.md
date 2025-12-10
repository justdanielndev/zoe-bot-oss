# Zoe's bot

After the sad demise of Slack workflows on the HC Slack, I moved what used to be a custom workflow here. It basically allows me to send it a DM message with whatever content I want to "yap" about, and then it reposts that message to a specific channel (my personal channel) when I click the "Yeah, looks :fire:" button. It also allows people to reply to the forwarded message in the channel, and it will post those replies as follow-ups to the original DM message, allowing for some back-and-forth between me and anyone who wants to respond to my yaps.

## Features

- DM listening and forwarding messages
- Yap replies and follow-ups
- Consent (:D idk, I wanted to add that to make sure people knew their messages could be public)

## Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Configure Environment Variables:**
    - Rename `.env.example` to `.env`.
    - Fill in:
        - `SLACK_BOT_TOKEN`: Your Bot User OAuth Token (starts with `xoxb-`).
        - `SLACK_SIGNING_SECRET`: Your App's Signing Secret.
        - `SLACK_APP_TOKEN`: Your App-Level Token (starts with `xapp-`). Enable Socket Mode in your Slack App settings.
        - `USER_ID`: The Slack User ID of the person the bot should listen to.
        - `CHANNEL_ID`: The Slack Channel ID where messages should be forwarded.

## Running

```bash
node index.js
```
(complex asf :D)

## Slack Config

1.  Create a new Slack App.
2.  Enable Socket Mode.
3.  Enable Events and subscribe to `message.im`.
4.  Add `chat:write`, `im:history` to Bot Token Scopes.
5.  Enable Interactivity.

 (psst, this project was submitted to Moonshot, check it out!)
<div align="center">
  <a href="https://moonshot.hackclub.com" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/35ad2be8c916670f3e1ac63c1df04d76a4b337d1_moonshot.png" 
         alt="This project is part of Moonshot, a 4-day hackathon in Florida visiting Kennedy Space Center and Universal Studios!" 
         style="width: 100%;">
  </a>
</div>
