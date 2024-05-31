import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import redisClient from "./redisUtil.js";

const AZURE_SUBSCRIPTION_KEY = "37d9984a024b4b468de99b4c0d01a44e";
const AZURE_REGION = "centralindia";

function randomAzureT2TApiKey() {
  return AZURE_SUBSCRIPTION_KEY;
}

export default async function translateTextWithAzure(
  text,
  targetLang,
  endpoint = "https://api.cognitive.microsofttranslator.com"
) {
  const url = `${endpoint}/translate`;
  const params = {
    "api-version": "3.0",
    to: targetLang,
    textType: "html",
  };
  const headers = {
    "Ocp-Apim-Subscription-Key": randomAzureT2TApiKey(),
    "Ocp-Apim-Subscription-Region": AZURE_REGION,
    "Content-type": "application/json",
    "X-ClientTraceId": uuidv4(),
  };
  const body = Array.isArray(text) ? text : [{ text: text }];

  const cacheKey = `translation:${targetLang}:${text}`;

  try {
    // Check if translation exists in Redis
    const cachedTranslation = await redisClient.get(cacheKey);
    if (cachedTranslation) {
      console.log("Translation found in cache");
      return JSON.parse(cachedTranslation);
    }

    // If not in cache, make the API call
    const response = await axios.post(url, body, { params, headers });
    if (response.status === 200) {
      const result = response.data;
      const translation = Array.isArray(text)
        ? result
        : result[0].translations[0].text;

      // Store the translation in Redis with an expiry time (e.g., 1 hour)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(translation));

      return translation;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error translating text:", error.message);
    return null;
  }
}
