import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Replace these with your actual Azure subscription key and region
const AZURE_SUBSCRIPTION_KEY = '37d9984a024b4b468de99b4c0d01a44e';
const AZURE_REGION = 'centralindia';

// Function to get a random Azure translation API key (stubbed here)
function randomAzureT2TApiKey() {
    // If you have multiple keys, you can return a random one
    return AZURE_SUBSCRIPTION_KEY;
}

export default async function translateTextWithAzure(text, targetLang, endpoint = 'https://api.cognitive.microsofttranslator.com') {
    const url = `${endpoint}/translate`;
    const params = {
        'api-version': '3.0',
        'to': targetLang,
        'textType': 'html'
    };
    const headers = {
        'Ocp-Apim-Subscription-Key': randomAzureT2TApiKey(),
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4()
    };
    const body = Array.isArray(text) ? text : [{ 'text': text }];

    try {
        const response = await axios.post(url, body, { params, headers });
        if (response.status === 200) {
            const result = response.data;
            return Array.isArray(text) ? result : result[0].translations[0].text;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error translating text:', error.message);
        return null;
    }
}




