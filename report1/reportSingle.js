const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

// --- CONFIGURATION ---
const apiId = 36521355; 
const apiHash = "e0afd99ef6508faddc6289aeca903150"; 
const targetPeer = "Interviewproxy"; 
const messageId = 42236; 

const sessions = [
    "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"
];

async function runReport() {
    for (let i = 0; i < sessions.length; i++) {
        const client = new TelegramClient(
            new StringSession(sessions[i]),
            apiId,
            apiHash,
            { connectionRetries: 5, useWSS: false } // Force TCP
        );

        try {
            await client.connect();
            console.log(`[Account ${i + 1}] Connected.`);

            const entity = await client.getEntity(targetPeer);

            // This is the one that worked! It reports the peer for the specific message.
            await client.invoke(
                new Api.account.ReportPeer({
                    peer: entity,
                    reason: new Api.InputReportReasonChildAbuse(),
                    message: `CSAM REPORT: Message ID ${messageId}`
                })
            );

            console.log(`✅ [Account ${i + 1}] Successfully reported to Telegram.`);
            
            await client.disconnect();
            if (i < sessions.length - 1) await new Promise(r => setTimeout(r, 2000));

        } catch (e) {
            console.log(`❌ [Account ${i + 1}] Failed: ${e.message}`);
            try { await client.disconnect(); } catch (err) {}
        }
    }
    console.log("\n--- MISSION COMPLETE: All reports sent. ---");
    process.exit(0); // This prevents the TIMEOUT errors
}

runReport();