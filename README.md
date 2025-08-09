# Pokerize - Real-time Planning Poker

A real-time planning poker application built with React, TypeScript, and Firebase Firestore.

## Features

- Real-time planning poker sessions
- Multiple players can join the same room
- Live vote synchronization
- Card reveal functionality
- Reset rounds
- Modern UI with Tailwind CSS

## Setup

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings → General → Your apps
5. Add a web app and copy the configuration

### 2. Configure Firebase

1. Open `src/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 3. Firestore Security Rules

Set up Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write: if true;
      
      match /players/{playerId} {
        allow read, write: if true;
      }
    }
  }
}
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
npm run dev
```

## Usage

1. Open the app in your browser
2. Enter your name
3. Share the room link with your team
4. Start voting on story points
5. Reveal votes when everyone has voted
6. Reset for the next story

## How it Works

- Each room is a Firestore document in the `rooms` collection
- Players are stored as subcollections under each room
- Real-time updates are handled by Firestore listeners
- All data is synchronized automatically across all connected clients

## Free Tier Limits

Firestore's free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- ~1 GiB storage
- ~10 GiB/month egress

This is more than sufficient for typical planning poker sessions with 5-10 people.
