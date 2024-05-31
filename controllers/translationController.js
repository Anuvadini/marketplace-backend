import translateTextWithAzure from "../Utils/translation.js";

export const translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).send({ error: "Text and targetLang are required" });
  }

  const translatedText = await translateTextWithAzure(text, targetLang);
  if (translatedText) {
    res.send({ translatedText });
  } else {
    res.status(500).send({ error: "Translation failed" });
  }
};
