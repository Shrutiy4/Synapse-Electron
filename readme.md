# Synapse Electron

A Windows-focused desktop productivity application built with Electron that helps users maintain distraction-free focus sessions by synchronizing focus state through Firebase and monitoring running applications.

## Overview

Synapse Electron provides a desktop layer for a cross-device focus workflow. The application maintains a shared focus state and reacts to local system activity so that distracting applications can be restricted while a focus session is active.

The application uses Electron's main process for system-level operations and exposes a limited API to the renderer through Electron's preload layer.

## Features

* **Focus mode synchronization** using Firebase Realtime Database
* **Real-time focus indicator** for the current session state
* **Automatic focus-state reset** during application startup and shutdown
* **Application monitoring** for detecting running processes
* **Distraction blocking** for configured applications during focus sessions
* **Interruption popup** when a restricted application is detected
* **Persistent local user identifier** for associating a desktop installation with its synchronized state
* **Electron IPC architecture** using `contextBridge` and controlled IPC channels
* **Separate main and popup windows** for the desktop experience
* **Error handling** for Firebase, filesystem, and process-management operations

## Architecture

The application follows a simple Electron architecture:

```text
┌──────────────────────────────┐
│         Renderer UI          │
│     HTML / CSS / JS          │
└──────────────┬───────────────┘
               │
        Controlled IPC
               │
┌──────────────▼───────────────┐
│          preload.js          │
│     contextBridge API        │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│           main.js            │
│  Electron + system services  │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
   Firebase         Windows
  Realtime DB     Process APIs
```

### Main components

| File               | Responsibility                                                           |
| ------------------ | ------------------------------------------------------------------------ |
| `main.js`          | Electron main process, application lifecycle and system-level operations |
| `preload.js`       | Secure bridge between renderer and main process                          |
| `renderer.js`      | Main application UI logic                                                |
| `popupRenderer.js` | Interruption popup logic                                                 |
| `index.html`       | Main application interface                                               |
| `popup.html`       | Focus interruption interface                                             |
| `styles.css`       | Main application styling                                                 |
| `popupstyle.css`   | Popup styling                                                            |
| `.env.example`     | Environment variable template                                            |

## Technology Stack

* **Electron**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Firebase Realtime Database**
* **Node.js**
* **systeminformation**
* **fkill**
* **nanoid**
* **dotenv**

## Requirements

* Windows
* Node.js 16 or later
* npm
* A Firebase project with Realtime Database enabled

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env` file in the project root:

```env
FIREBASE_URL=your_firebase_realtime_database_url
API_KEY=your_firebase_web_api_key
```

Do not commit your actual `.env` file or Firebase credentials.

### 3. Start the application

```bash
npm start
```

## Security Considerations

The application uses Electron's preload architecture to keep Node.js capabilities separated from renderer code.

Key security measures include:

* `contextIsolation` for renderer isolation
* `nodeIntegration` disabled for renderer content
* Controlled APIs exposed through `contextBridge`
* Firebase configuration supplied through environment variables
* System-level operations kept in the Electron main process

## Project Structure

```text
Synapse-Electron/
│
├── assets/
│   ├── logosynapse.png
│   ├── titlelogo.svg
│   └── Mediamodifier-Design.svg
│
├── index.html
├── main.js
├── preload.js
├── renderer.js
│
├── popup.html
├── popupRenderer.js
│
├── styles.css
├── popupstyle.css
│
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Development

The project is intentionally kept lightweight and uses Electron's native process model rather than introducing a large frontend framework.

Areas suitable for further development include:

* Configurable focus profiles
* Improved process-management rules
* Cross-platform process support
* Session history and analytics
* Desktop notifications
* Improved synchronization conflict handling
* Packaging and auto-update support

## License

See the repository's license information for the terms applicable to the project and its dependencies.
