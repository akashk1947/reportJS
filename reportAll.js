
// Simple runner for all report.js files in report1-6 with random 5-10 min gap
const { spawn } = require('child_process');
const path = require('path');

const REPORT_FOLDERS = ['report1', 'report2', 'report3', 'report4', 'report5', 'report6'];
const REPORT_SCRIPT = 'report.js';

// Returns a random delay in milliseconds between 5 and 10 minutes
function getRandomDelayMs() {
    const min = 5 * 60 * 1000; // 5 minutes
    const max = 10 * 60 * 1000; // 10 minutes
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runReportsSequentially() {
    for (let i = 0; i < REPORT_FOLDERS.length; i++) {
        const folder = REPORT_FOLDERS[i];
        const scriptPath = path.join(__dirname, folder, REPORT_SCRIPT);
        console.log(`\n[${new Date().toLocaleTimeString()}] Running: ${scriptPath}`);

        await new Promise((resolve, reject) => {
            const proc = spawn('node', [scriptPath], { stdio: 'inherit' });
            proc.on('close', (code) => {
                console.log(`[${folder}] exited with code ${code}`);
                resolve();
            });
            proc.on('error', reject);
        });

        if (i < REPORT_FOLDERS.length - 1) {
            const delay = getRandomDelayMs();
            console.log(`Waiting ${(delay / 60000).toFixed(2)} minutes before next report...`);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
    console.log('\nAll reports completed.');
}

runReportsSequentially().catch((err) => {
    console.error('Error running reports:', err);
    process.exit(1);
});
