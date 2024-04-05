import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function uploadFilesToRag(filePaths, email_id) {
  const document_id = uuidv4();

  const form = new FormData();
  form.append("document_id", document_id);
  form.append("email_id", email_id);
  filePaths.forEach((filePath) => {
    form.append("pdfs", fs.createReadStream(filePath));
  });

  try {
    const response = await axios.post(
      "https://merchant-upload.futurixai.com/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    const collectionName = response.data.collection_name;

    return collectionName;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}
