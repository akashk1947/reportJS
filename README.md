# ReportJS Project - Quick Start Guide

Welcome to the ReportJS project! This guide will help new users understand the structure and usage of this codebase for reporting accounts using multiple modules.

## Project Structure
- `report1/`, `report2/`, `report3/`: Each folder is a separate reporting module. You can add more (e.g., `report4/`) as needed.
- Each module contains:
  - `login.js`: Handles login for that module.
  - `api.js`: API configuration (set your API ID and API Hash here).
  - `report.js` / `reportSingle.js`: Scripts to report accounts (all or single).
  - `addSession.js`, `sessions.mjs`: Manage user sessions.

## Getting Started

### 1. Install Dependencies
Go into the desired report module folder (e.g., `report1/`) and run:

    npm install

Repeat for each module you want to use.

### 2. Configure API Credentials
- Open `api.js` in each report folder.
- Add your API ID and API Hash for that module.
- Each module can use a different API ID/Hash if needed.

### 3. Login
- Run the login script for the module you want to use:

    node login.js

- Follow the prompts to log in (usually via phone number and code).

### 4. Reporting Accounts
- To report a single account:

    node reportSingle.js

- To report all accounts from a list:

    node report.js

- Follow the prompts or edit the script to specify targets.

### 5. Extending the Project
- To add a new report module (e.g., `report4/`):
  1. Copy one of the existing report folders.
  2. Update `api.js` with a new API ID and API Hash.
  3. Install dependencies and follow the steps above.

## Notes
- Each report module works independently and can use different API credentials.
- Sessions are stored per module in `sessions.mjs`.
- For troubleshooting, check the `note.txt` in each module folder.

---

For more details, review the code and comments in each file. Happy reporting!
