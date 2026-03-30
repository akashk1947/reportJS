const fs = require('fs');
const path = require('path');

function addSession(newSession) {
    const filePath = path.join(__dirname, 'sessions.mjs');
    let content = fs.readFileSync(filePath, 'utf-8');
    // Find the array and insert before the closing bracket
    content = content.replace(/(const sessions = \[)([\s\S]*?)(\];)/, (match, start, middle, end) => {
        // Remove trailing comma if present
        middle = middle.trim().replace(/,?$/, '');
        return `${start}\n    ${middle},\n    "${newSession}"\n${end}`;
    });
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Session added!');
}

// Usage example:
// addSession('YOUR_NEW_SESSION_STRING');

module.exports = { addSession };