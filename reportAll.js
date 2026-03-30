const { TelegramClient, Api, Logger } = require("telegram");
const { StringSession } = require("telegram/sessions");
const {default : links} = require("./links.mjs");
const {default : sessions} = require("./sessions.mjs");

// --- CONFIGURATION ---
const apiId = 36521355; 
const apiHash = "e0afd99ef6508faddc6289aeca903150"; 


// Add your post links here
const linksToReport = links?.split("\n").map(line => line.trim()).filter(line => (line.length > 0)).map(line => {
    const split = (line.split(" "));
    const extractedLink = split[split.length - 1]; 
    return extractedLink;
});

function sanitizeUsername(username) {
    if (!username) return username;
    
    // More aggressive: keep only alphanumeric, underscore, and dash
    const sanitized = username.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Debug: log if something was removed
    if (username !== sanitized) {
        console.log(`[DEBUG] Username changed from "${username}" (codes: ${[...username].map(c => c.charCodeAt(0)).join(',')}) to "${sanitized}"`);
    }
    
    return sanitized;
}

function parseLink(link) {
    const cleanLink = link.replace("https://t.me/", "").replace("@", "");
    const parts = cleanLink.split("/");
    return {
        username: sanitizeUsername(parts[0]),
        id: parseInt(parts[1])
    };
}

async function runReport() {
    // 1. Prepare the tasks from links
    const reportTasks = linksToReport.map(link => parseLink(link));
    
    for (let i = 0; i < sessions.length; i++) {
        const client = new TelegramClient(
            new StringSession(sessions[i]),
            apiId,
            apiHash,
            { connectionRetries: 5, useWSS: false, baseLogger: new Logger("none") }
        );

        try {
            await client.connect();
            const me = await client.getMe();
            console.log(`\n[Account No.${i + 1} ${me.username || me.firstName}_${me.phone}] Connected.`);

            // Process each message link for the current account
            for (const task of reportTasks) {
                try {
                    const entity = await client.getEntity(task.username);
                    
                    await client.invoke(
                            new Api.account.ReportPeer({
                                peer: entity,
                                reason: new Api.InputReportReasonChildAbuse(),
                                message: `CSAM REPORT: Message ID ${task.id}`
                            })
                        );
                    
                        console.log(`   ✅ Reported https://t.me/${task.username}/${task.id}`);

                        // ADD THIS: Small gap between reports on the same account
                        const randomS = (Math.floor(Math.random()*10))*1000;
                        await new Promise(r => setTimeout(r, randomS));
                } catch (taskErr) {
                    console.log(`   ⚠️ Failed to report msg ${task.id}: ${taskErr.message}`);
                }
            }
            
            await client.disconnect();
            
            // Short delay between accounts to avoid flood limits
            if (i < sessions.length - 1) {
                console.log("Waiting 3 seconds for next account...");
                await new Promise(r => setTimeout(r, 1000));
            }

        } catch (e) {
            console.log(`❌ [Account ${i + 1}] Connection Failed: ${e.message}`);
            try { await client.disconnect(); } catch (err) {}
        }
    }
    
    console.log("\n--- MISSION COMPLETE: All reports processed. ---");
    process.exit(0);
}

runReport();
