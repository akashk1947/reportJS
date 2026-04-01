
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const { addSession } = require("./addSession.js");
const { api_id, api_hash } = require("./api.js");

(async () => {
    const client = new TelegramClient(new StringSession(""), api_id, api_hash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text("Enter Phone Number (e.g. +91...): "),
        password: async () => await input.text("Enter 2FA Password (if any): "),
        phoneCode: async () => await input.text("Enter Telegram Code: "),
        onError: (err) => console.log(err),
    });

    const sessionString = client.session.save();
    console.log("\n--- COPY THE STRING BELOW ---");
    console.log(sessionString);
    console.log("--- END OF STRING ---\n");

    // Automatically add the new session to sessions.mjs
    try {
        addSession(sessionString);
    } catch (err) {
        console.error("Failed to add session to sessions.mjs:", err.message);
    }

    await client.disconnect();
    process.exit();
})();