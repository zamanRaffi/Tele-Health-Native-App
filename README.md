# 🏥 Tele-Health Native App

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey?logo=android&logoColor=white)
![NativeWind](https://img.shields.io/badge/Styling-NativeWind-38BDF8?logo=tailwindcss&logoColor=white)

A cross-platform **Tele-Health mobile application** built with React Native & Expo. Supports Android, iOS, and Web from a single codebase.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the App](#-running-the-app)
- [Dependencies](#-dependencies)

---

## ✨ Features

- 📱 Cross-platform — Android, iOS & Web from one codebase
- 🗺️ File-based routing with **Expo Router**
- 🎨 Utility-first styling with **NativeWind** (Tailwind for React Native)
- 🔄 Server state management with **TanStack React Query**
- 🗃️ Client state management with **Zustand**
- 📍 Location services via **Expo Location**
- 🖼️ Optimized image handling with **Expo Image** & image picker
- 💾 Persistent storage with **AsyncStorage**
- 🔒 Type-safe forms & validation with **Zod**
- ✋ Gesture support with **React Native Gesture Handler**
- 🌈 Linear gradients & blur effects
- 🦴 Skeleton loading placeholders
- 📳 Haptic feedback support

---

## 🛠️ Tech Stack

| Category            | Technology                          |
|---------------------|-------------------------------------|
| Framework           | React Native 0.81 + Expo 54        |
| Language            | TypeScript 5.9                      |
| Navigation          | Expo Router 6 (file-based)         |
| Styling             | NativeWind 4 (Tailwind CSS)        |
| Server State        | TanStack React Query 5             |
| Client State        | Zustand 5                          |
| Validation          | Zod 4                              |
| Storage             | AsyncStorage                        |
| Icons               | @expo/vector-icons                  |

---

## 📁 Project Structure

```
Tele-Health-Native-App/
├── app/                  # Screens & layouts (Expo Router file-based routing)
├── constants/            # App-wide constants (colors, config, etc.)
├── context/              # React context providers
├── mocks/                # Mock data for development
├── types/                # TypeScript type definitions
├── assets/               # Images, fonts, icons
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── babel.config.js       # Babel config
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your phone (for quick testing)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/zamanRaffi/Tele-Health-Native-App.git
cd Tele-Health-Native-App
```

2. **Install dependencies**

```bash
npm install
```

---

## ▶️ Running the App

### Start the development server

```bash
npx expo start
```

This will open the Expo Dev Tools in your browser. From there you can:

| Option | Command | Description |
|--------|---------|-------------|
| Expo Go (phone) | Scan QR code | Run on physical device |
| Android Emulator | Press `a` | Requires Android Studio |
| iOS Simulator | Press `i` | Requires Xcode (macOS only) |
| Web Browser | Press `w` | Run in browser |

### Platform-specific commands

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 📦 Dependencies

### Core

```json
"expo": "^54.0.20"
"react": "19.1.0"
"react-native": "^0.81.5"
"typescript": "~5.9.2"
"expo-router": "~6.0.13"
```

### UI & Styling

```json
"nativewind": "^4.1.23"
"expo-linear-gradient": "~15.0.7"
"expo-blur": "~15.0.7"
"expo-image": "~3.0.10"
"react-native-skeleton-placeholder": "^5.2.4"
"react-native-svg": "15.12.1"
"@expo/vector-icons": "^15.0.3"
```

### State & Data

```json
"@tanstack/react-query": "^5.90.9"
"zustand": "^5.0.2"
"zod": "^4.1.12"
"@react-native-async-storage/async-storage": "2.2.0"
```

### Navigation & Gestures

```json
"@react-navigation/native": "^7.1.22"
"@react-navigation/material-top-tabs": "^7.4.5"
"react-native-gesture-handler": "~2.28.0"
"react-native-screens": "~4.16.0"
"react-native-tab-view": "^4.2.0"
```

---

## 📜 License

This project is private. All rights reserved.
 

