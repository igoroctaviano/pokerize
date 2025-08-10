# Pokerize - Real-time Planning Poker

A real-time planning poker application built with React, TypeScript, and Firebase Firestore.

## Features

- Real-time planning poker sessions
- Multiple players can join the same room
- Live vote synchronization
- Card reveal functionality
- Reset rounds
- Modern UI with Tailwind CSS and Radix UI components

## Prerequisites

- Node.js 21.x or higher
- Yarn (recommended) or npm
- Firebase account

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase Firestore (real-time database)
- **Deployment**: Firebase Hosting
- **Code Quality**: ESLint, Prettier

## Setup

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings → General → Your apps
5. Add a web app and copy the configuration

### 2. Configure Firebase

**Option A: Use the setup script (recommended)**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

**Option B: Manual setup**
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and replace the placeholder values with your actual Firebase config:

```bash
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note**: This project is configured to deploy to the `pokerize-app` Firebase project. If you're setting up your own instance, update the project ID accordingly.

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
yarn install
```

### 5. Run the App

```bash
yarn dev
```

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn type-check` - Run TypeScript type checking
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn clean` - Clean and reinstall dependencies
- `yarn install-deps` - Install dependencies

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## Deployment

### Deploy to Firebase Hosting

#### Local Deployment

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init hosting
   ```

4. Deploy using the provided script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

Or deploy manually:
```bash
yarn build
firebase deploy --only hosting
```

Your app will be available at: `https://pokerize-app.web.app`

#### GitHub Actions Deployment

The project includes automatic deployment via GitHub Actions. To set this up:

1. **Generate Firebase Token**:
   ```bash
   firebase login:ci
   ```
   This will open a browser window. After authentication, copy the token.

2. **Add GitHub Secrets**:
   Go to your repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   - `FIREBASE_TOKEN` - The token from step 1
   - `VITE_FIREBASE_API_KEY` - Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID` - Your Firebase app ID

3. **Automatic Deployment**:
   - Push to the `main` branch to trigger automatic deployment
   - The app will be deployed to Firebase Hosting automatically
   - The workflow includes debugging steps to verify the Firebase token is set correctly

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

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
