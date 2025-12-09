const { App } = require('@slack/bolt');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

const USER_ID = process.env.USER_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.message(async ({ message, say }) => {
    if (message.channel_type === 'im' && message.user === USER_ID) {
        await say({
            text: message.text,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "*Do you want to yap this?*\n\n" + message.text
                    }
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Yeah, looks :fire:",
                                emoji: true
                            },
                            value: message.text,
                            action_id: "fire_button_click"
                        }
                    ]
                }
            ]
        });
    }
});

app.action('fire_button_click', async ({ body, ack, client }) => {
    await ack();

    const originalMessage = body.actions[0].value;

    try {
        await client.chat.postMessage({
            channel: CHANNEL_ID,
            text: `<!subteam^S09LUMPUBU0|cultists> *New yap! Go read it :tw_knife:*\n\n${originalMessage}`
        });

        await client.chat.postMessage({
            channel: CHANNEL_ID,
            text: "Pls thread here! :D",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "Pls thread here! :D"
                    }
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Suggest a new yap",
                                emoji: false,
                            },
                            action_id: "reply_button_click",
                            value: originalMessage
                        }
                    ]
                }
            ]
        });

    } catch (error) {
        console.error(error);
    }
});

app.action('reply_button_click', async ({ body, ack, client }) => {
    await ack();

    const originalMessage = body.actions[0].value;

    try {
        await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                private_metadata: originalMessage,
                callback_id: 'suggest_yap_submission',
                title: {
                    type: 'plain_text',
                    text: 'Yap suggestion'
                },
                blocks: [
                    {
                        type: 'input',
                        block_id: 'yap_input_block',
                        element: {
                            type: 'plain_text_input',
                            action_id: 'yap_input_action',
                            multiline: true
                        },
                        label: {
                            type: 'plain_text',
                            text: 'What do you want Zoe to yap about?'
                        }
                    },
                    {
                        type: 'input',
                        block_id: 'consent_block',
                        element: {
                            type: 'checkboxes',
                            action_id: 'consent_action',
                            options: [
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Yes'
                                    },
                                    value: 'consent_given'
                                }
                            ],
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Are you ok with your question being shown? NOT your name, questions are anonymized.'
                        }
                    }
                ],
                submit: {
                    type: 'plain_text',
                    text: 'Send Yap :3'
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
});

app.view('suggest_yap_submission', async ({ ack, body, view, client }) => {
    await ack();

    const suggestion = view.state.values.yap_input_block.yap_input_action.value;
    const user = body.user.id;
    const originalMessage = view.private_metadata;

    try {
        await client.chat.postMessage({
            channel: USER_ID,
            text: `New yap suggestion! "${suggestion}"\nOriginal Yap: "${originalMessage}"`
        });
        await client.chat.postMessage({
            channel: USER_ID,
            text: "Reply",
            blocks: [
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Reply to the suggestion",
                                emoji: false,
                            },
                            action_id: "suggestion_reply_button_click",
                            value: suggestion
                        }
                    ]
                }
            ]
        });
    } catch (error) {
        console.error(error);
    }
});

app.action('suggestion_reply_button_click', async ({ body, ack, client }) => {
    await ack();
    const suggestion = body.actions[0].value;
    try {
        await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                private_metadata: suggestion,
                callback_id: 'reply_yap_suggestion',
                title: {
                    type: 'plain_text',
                    text: 'Reply to suggestion'
                },
                blocks: [
                    {
                        type: 'input',
                        block_id: 'yap_input_block',
                        element: {
                            type: 'plain_text_input',
                            action_id: 'yap_input_action',
                            multiline: true
                        },
                        label: {
                            type: 'plain_text',
                            text: 'What do you reply to "' + suggestion + '"?'
                        }
                    },
                ],
                submit: {
                    type: 'plain_text',
                    text: 'Reply :3'
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
});

app.view('reply_yap_suggestion', async ({ ack, body, view, client }) => {
    await ack();
    const reply = view.state.values.yap_input_block.yap_input_action.value;
    const suggestion = view.private_metadata;
    try {
        await client.chat.postMessage({
            channel: CHANNEL_ID,
            text: `<!subteam^S09LUMPUBU0|cultists> *New yap! Go read it :tw_knife:*\n_(Replying to: "${suggestion}")_\n\n${reply}`
        });
        
        await client.chat.postMessage({
            channel: CHANNEL_ID,
            text: "Pls thread here! :D",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "Pls thread here! :D"
                    }
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Suggest a new yap",
                                emoji: false,
                            },
                            action_id: "reply_button_click",
                            value: reply
                        }
                    ]
                }
            ]
        });

    }
    catch (error) {
        console.error(error);
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('Running :3');
})();
