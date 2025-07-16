/*
....2x25■■
.....crøwexx
⌙ the chatGPT images
*/

import OpenAI, { toFile } from 'openai';
import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
const openai = new OpenAI();
const gemini = new GoogleGenAI({
  projectId: 'gen-lang-client-0491271060',
});

// const characterImageFile = './public/i/rebel-211.png';
const characterImageFile =
  'https://www.tokyorebels.io/_next/image?url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmNrjvpgSTAdGc35qM6j2qkxqYTTGGKm1sXXQcufQhKfxG&w=828&q=75';

async function generate(prompt) {
  console.log('_____image gen______');
  try {
    // const response = await fetch(characterImageFile);
    // const imageArrayBuffer = await response.arrayBuffer();
    // const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    const result = await gemini.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `create an image with ${prompt}`,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
        outputCompressionQuality: 70,
      },
    });

    return result.generatedImages[0].image.imageBytes;
    //
    //
    // const result = await openai.images.generate({
    //   model: 'gpt-image-1',
    //   prompt,
    //   size: '1536x1024',
    //   quality: 'low',
    // });

    // // // Save the image to a file
    return result.data[0].b64_json;
    // console.log(image_base64);
    // const image_bytes = Buffer.from(image_base64, 'base64');
    // fs.writeFileSync('otter.png', image_bytes);
  } catch (e) {
    console.error(e.message);
  }
}

const handler = async (req, res) => {
  if (req.method !== 'POST')
    return res.status(405).json({ message: `must use POST` });

  const ENVIRONMENT_EVENT = req.body;
  if (!ENVIRONMENT_EVENT)
    return res.status(500).json({ message: 'no text found for image' });

  const response = await generate(ENVIRONMENT_EVENT);

  console.log('_____end image gen______');
  return res.status(200).json({
    image: response,
  });
};

export default handler;
