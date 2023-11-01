const { initializeApp } = require("firebase/app");
const {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = require("./firebase.config");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a download URL
const storage = getStorage(app);

/**
 * Upload files
 * @param {Express.Multer.File} file
 */
const uploadFileToFireStore = async (file) => {
  try {
    const date = new Date();

    const metadata = {
      contentType: file.mimetype,
    };
    // 'file' comes from the Blob or File API
    let storageRef = ref(storage, `files/${file.originalname + "  " + date}`);

    // Upload the file in the bucket storage
    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.", downloadURL);

    return downloadURL;
  } catch (error) {
    console.log(error);
  }
};

module.exports = uploadFileToFireStore;
