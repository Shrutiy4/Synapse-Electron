# 🧠 Synapse – Electron Focus Broadcaster
A lightweight Electron-based focus state manager that syncs your focus mode across devices using Firebase.
Designed to work with the full Synapse ecosystem (Mobile App + Chrome Extension), this app enforces distraction-free workflows across desktop, browser, and mobile, all in real-time.

---

## ✅ Features
- Two-way sync with Firebase (Realtime DB): Seamlessly updates and reads focusMode.
- FocusMode Auto-reset: Automatically resets to OFF on app start and safe exit.
- Live Focus Indicator: Visual ON/OFF indicator updates every second.
- Secure Preload Architecture:
    - Uses contextBridge and ipcRenderer.invoke channels only.
    - Completely isolates Node.js logic from renderer.
- Background Process Monitoring:
    - Detects whitelisted productivity apps.
    - Instantly kills blacklisted distraction apps when focus is triggered.
- Popup Interruption Alert:
    - Custom modal (popup.html) triggered when user tries to open a blacklisted app.
    - Asks user for intent before continuing.
- Auto-generated User ID:
    - 8-character secure ID saved in data/user_id.txt.
    - Displayed as XXXX-XXXX in UI.
- Optimized IPC Channels:
    - getFocusMode, setFocusMode, resetFocusMode, and getUsername.
- State-aware Polling Loop:
    - Every 1.5s, checks system processes to determine active mode.

    - Prevents redundant writes to Firebase.

- Supports Popup + Main UI:
    - Independent windows for main dashboard and interruption modal.
- Failsafe Error Logging:
    - Gracefully handles all fetch, file system, and process-killing errors.
- Fullscreen, distraction-free experience:
    - Intended for immersive workflows.
    - Can run silently in background on startup.

---

## 🧩 Requirements

- *Currently only compatible with Windows*
- *Node.js v16+*
- *Firebase Project with:*
    - Realtime Database enabled
    - Web API Key generated

---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya11835/Synapse-Electron.git
cd synapse-electron
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory:
```bash
FIREBASE_URL=https://your-database-url.firebaseio.com
API_KEY=your_firebase_web_api_key
```

## ▶️ Run the App
```bash
npm run start
```

---

## 🌐 Works With
| Component           | Repo                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| 📱 Flutter App      | [Synapse-Mobile](https://github.com/Zyphon12342/HarmonicDistruptionApp)                  |
| 🌐 Chrome Extension | [Synapse-Extension](https://github.com/Utsavvv1/browser-ext) |

## 👥 Contributors
| Name                  | GitHub                                                         |
| --------------------- | -------------------------------------------------------------- |
| Utsav Verma           | [@Utsavvv1](https://github.com/Utsavvv1)                       |
| Aaryan Singh Rathore  | [@AaryanSingthRathore](https://github.com/AaryanSingthRathore) |
| Anomitra Bhattacharya | [@anomitroid](https://github.com/anomitroid)                   |
| Aditya Negi           | [@Aditya11835](https://github.com/Aditya11835)                 |
| Shivansh Kandpal      | [@Zyphon12342](https://github.com/Zyphon12342)                 |

## 🛡 Security Highlights (New)
- contextIsolation: true and nodeIntegration: false enforced.
- Only whitelisted APIs are exposed via preload.js.
- Firebase credentials remain local via .env file (never hardcoded).
- App logic centralized in main.js, keeping preload.js minimal.

## 📜 License
This project is licensed under the ICS License.