require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.G_API_KEY,
  authDomain: process.env.G_AUTH_DOMAIN,
  projectId: process.env.G_PROJECT_ID,
  storageBucket: process.env.G_STORAGE_BUCKET,
  messagingSenderId: process.env.G_MESSAGING_SENDER_ID,
  appId: process.env.G_APP_ID,
};
module.exports = firebaseConfig;
