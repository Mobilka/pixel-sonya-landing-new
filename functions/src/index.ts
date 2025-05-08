/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Busboy from "busboy";
import {v4 as uuidv4} from "uuid";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const uploadPhoto = onRequest(async (req, res): Promise<void> => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const busboy = new (Busboy as any)({headers: req.headers});
  const uploads: Promise<string>[] = [];
  let fileUploaded = false;

  busboy.on(
    "file",
    (
      fieldname: string,
      file: NodeJS.ReadableStream,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      fileUploaded = true;
      const bucket = admin.storage().bucket();
      const destination = `uploads/${uuidv4()}-${filename}`;
      const fileUpload = bucket.file(destination);
      const stream = file.pipe(
        fileUpload.createWriteStream({metadata: {contentType: mimetype}})
      );
      uploads.push(
        new Promise((resolve, reject) => {
          stream.on("finish", async () => {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
            resolve(publicUrl);
          });
          stream.on("error", reject);
        })
      );
    }
  );

  busboy.on("finish", async () => {
    if (!fileUploaded) {
      res.status(400).send("No file uploaded");
      return;
    }
    try {
      const urls = await Promise.all(uploads);
      res.status(200).json({urls});
    } catch (err) {
      res.status(500).send("Upload error: " + err);
    }
  });

  req.pipe(busboy);
});

export const updateText = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const {docId, data} = req.body;
  if (!docId || !data) {
    res.status(400).send("Missing docId or data");
    return;
  }
  try {
    await admin
      .firestore()
      .collection("texts")
      .doc(docId)
      .set(data, {merge: true});
    res.status(200).send("Text updated");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});
