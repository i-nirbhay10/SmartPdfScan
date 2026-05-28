# SmartPDFScan 📄✨

A modern, premium React Native application for scanning documents and converting them into high-quality PDFs. 

## Features
- **Smart Edge Detection & Cropping**: Uses the device camera with auto edge detection for perfect document scanning.
- **High-Quality PDF Export**: Converts all scanned pages into A4 sized PDF documents.
- **Seamless Sharing**: Share generated PDFs instantly to any application.
- **Dynamic Theming**: Full support for Dark Mode and Light Mode with a sleek, minimalist UI.
- **Edge-to-Edge Design**: Full Bottom Safe Area support ensures the app looks native and elegant on all notch and bezel-less devices.

## Tech Stack
- **Framework**: React Native CLI (v0.85+)
- **State Management**: Zustand
- **Navigation**: React Navigation (Native Stack)
- **Scanning**: `react-native-document-scanner-plugin`
- **PDF Generation**: `react-native-image-to-pdf`
- **File Management**: `react-native-fs`, `react-native-share`

## Getting Started

### Prerequisites
- Node.js
- Android SDK & Emulator (for Windows/Linux)
- Xcode (for macOS users)

### Installation
1. Clone this repository.
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

#### Android
Ensure your Android emulator is running or device is connected, then run:
```sh
npm run android
```
*Note: We use Java 9+ which requires Android SDK compileSdkVersion 34+.*

#### iOS
Ensure you have CocoaPods installed.
```sh
cd ios && pod install && cd ..
npm run ios
```

## Architecture & Structure
- `src/screens/` - Contains all application screens (Home, Document, Settings).
- `src/theme/` - Centralized color tokens for seamless Light/Dark mode transitions.
- `src/store/` - Global state setup using Zustand.
- `src/navigation/` - Stack configuration using React Navigation.

## Troubleshooting
If you face `ClassNotFoundException: MainApplication` or `FileSystemException` (file in use) on Android:
1. Stop gradle daemon: `cd android && ./gradlew --stop`
2. Clean gradle cache: `./gradlew clean`
3. Re-run: `npm run android`
