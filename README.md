# Coppel Emprende - Microentrepreneur Registration System

**Coppel Emprende** is a React Native mobile application developed for the Talent Land 2025 Hackathon. It empowers Coppel’s debt collection collaborators to register microentrepreneurs encountered during their field routes through a voice-assisted, geolocation-aware system.

## 🧠 Overview

The system integrates cutting-edge technologies such as:
- **Firebase** for backend and authentication
- **OpenAI GPT-4 & Whisper** for voice-to-text transcription and data extraction
- **Google Maps SDK** for geolocation and map-based interactions

Its core goal is to streamline microentrepreneur registration, provide valuable data to Coppel, and offer microentrepreneurs visibility and connection opportunities.

---

## 🛠 Technical Architecture

- **Frontend**: React Native (Expo)
- **Backend Services**: Firebase (Firestore, Auth, Cloud Functions)
- **AI Integration**: Whisper for speech-to-text, GPT-4 for natural language understanding
- **Maps**: Google Maps SDK + Places API
- **Dashboard**: Web-based admin panel (React + Firebase)

---

## ✨ Key Features

### 1. Voice-Assisted Registration
- 🎙 **Permission-based Recording**: Users must explicitly accept audio recording.
- 🧾 **Transcription with Whisper**: Converts real-time conversations to text.
- 📋 **Data Extraction via GPT-4**: Parses relevant registration data from natural speech.
- ✅ **Form Auto-Completion**: Automatically fills out forms for review and submission.

### 2. User Authentication & Authorization
- 🔐 Firebase Auth for Coppel collaborators
- 🔢 PIN-based access system for registered microentrepreneurs

### 3. Geolocation Features
- 🗺️ Interactive map showing nearby microentrepreneurs
- 📍 Location-based business suggestions
- 🧭 Route-optimized field experience

### 4. Ranking & Gamification
- 📈 Weekly performance tracking
- 🏅 Level-based rewards system (Bronze, Silver, Gold)
- 👥 Collaborator leaderboard

### 5. Admin Dashboard
- 🧑‍💼 Monitor registrations and collaborator activity
- 📊 Track progress by region, collaborator, and time period
- 🔔 Real-time alerts for new submissions and goals achieved

---

## 🧩 Component Structure

- `AudioRecorder`: Handles permission, recording and saving audio
- `TranscriberService`: Uses Whisper API to convert speech to text
- `DataExtractor`: Sends transcribed text to GPT-4 for field extraction
- `FormBuilder`: Fills form fields automatically based on extracted data
- `MapView`: Displays geolocated businesses and nearby collaborators
- `Dashboard`: Admin panel for real-time tracking and stats

---

## 🔌 API Integrations

- [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI GPT-4](https://platform.openai.com/docs/guides/completion)
- [Firebase](https://firebase.google.com/)
- [Google Maps SDK](https://developers.google.com/maps/documentation)

---

## ⚙️ Environment Variables

Create a `.env` file with:
```env
# Firebase configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
FIREBASE_APP_ID=your_firebase_app_id_here

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Replicate configuration
WHISPER_MODEL_VERSION=your_whisper_model_version_here
```

---

## 🚀 Setup Instructions

1. Clone this repo
```bash
git clone https://github.com/UrielP-Dev/Nexus-Contributor
```

2. Install dependencies
```bash
cd Nexus-Contributor
npm install
```

3. Configure Firebase and environment variables
4. Start the development server
```bash
npx expo start
```

---

## 🔧 Implementation Details

- **Security**: Audio is stored temporarily and deleted post-processing. Consent is required before recording.
- **Performance**: Optimized for offline data caching and low-memory devices.
- **Architecture**: Feature-based folder structure for better scalability and maintenance.

---

## 🔮 Future Enhancements

- Offline mode for low-connectivity zones
- Multi-language support (Spanish, Indigenous Languages)
- Expanded analytics on entrepreneur engagement and demographics

---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 📬 Contact

For technical questions or to contribute, contact the project maintainer at: [antoniourielperezpichardo@gmail.com]

## Admin Dashboard

[Admin Dashboard](https://github.com/JonatanAtenogenes/Nexus-Dashboard)

## Contributors
- https://github.com/Gubler-01
- https://github.com/JonatanAtenogenes
- https://github.com/BrunoMM3
