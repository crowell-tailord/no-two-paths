/*
....2x25■■
.....crøwexx
⌙ the chatGPT images
*/

import OpenAI from 'openai';
// import fs from 'fs';
const openai = new OpenAI();

const CHARACTER = `Main female Character with her fiery bo staff, who has coral colored skin and a cherry tattoo, her eyes are fiery and a smirk on her face, short acid colored hair fluttering in the wind, wearing headphones and a acid colored gasmask and punk-styled, spiked acid colored goggles`;

const DESCRIBERS = `award-winning anime style graphic`;

async function generate(prompt) {
  console.log('_____image gen______');
  try {
    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'low',
    });

    // Save the image to a file
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

  const PROMPT = `create an image of ${ENVIRONMENT_EVENT} and the ${CHARACTER} in the scene in the style of ${DESCRIBERS}`;

  const response = await generate(PROMPT);

  console.log('_____end image gen______');
  return res.status(200).json({
    image: response,
  });
};

export default handler;
