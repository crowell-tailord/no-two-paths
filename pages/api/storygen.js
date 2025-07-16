/*
....2x25■■
.....crøwexx
⌙ the *ai*
*/

import OpenAI from 'openai';
import transformations from '/func/transformations';
const openai = new OpenAI();

/*
1/ generate init prompt with 2 choices, and image desc
2/ generate image
3/ summarize
4/ generate choice 1, with 2 choices, and image desc
5/ generate choice 2, with 2 choices and image desc
6/ generate choice 1 image
7/ summarize up to choice 1
8/ generate choice 2 image
9/ summarize up to choice 2
*/

const SYSTEM_PROMPT = `
You are a narrative AI for an interactive storytelling game based off "Tokyo Rebels." 

Your job is to continue a dark cyberpunk storyline set in a post-apocalyptic Tokyo devastated by a mutagenic event known as the Red Mist. Players make decisions at each step that shape the story.

Lore:
- Karoshi Pharmaceuticals rules the city from Izori Ward
- Senzaki Ward is home to the Commons and the vigilante Hunters
- The Tokyo Ten are elite protectors resisting Karoshi's grip
- Ghouls are mutated humans infected by the Red Mist
- Players may encounter allies, enemies, relics, or betrayals
Always stay consistent with this universe. Do not reference any events outside this setting.
`;

const CHARACTER = {
  class: 'Rebel',
  gender: 'Female',
  originLocation: 'Kuebiko Workshop',
  weapon: 'Bo Staff',
  weaponColor: 'Fire',
  skinColor: 'Coral',
  tattoo: 'Cherry',
  eyes: 'Feminine Neutral',
  eyeColor: 'Fire',
  mouth: 'Smirk',
  hair: 'Short',
  hairColor: 'Acid',
  clothes: 'Headphones',
  mask: 'Gasmask',
  maskColor: 'Acid',
  eyewear: 'Punk',
  eyewearColor: 'Acid',
};

const CHARACTER_STRING = Object.keys(CHARACTER).reduce(
  (string, trait) => string + `${trait}: ${CHARACTER[trait]}, `,
  ''
);

// const xCHARS = `"Class: Rebel","Gender: Female","Background: Kuebiko Workshop","Weapon: Bo Staff (Fire)","Skin: Coral","Tattoo: Cherry","Eyes: Feminine Neutral (Fire)","Mouth: Smirk","Hair: Short (Acid)","Clothes: Headphones","Mask: Gasmask (Acid)","Eyewear: Punk (Acid)"`;

// const xINITPROMPT = `Write me the first two paragrahps of a Choose Your Own Adventure style story. The Main Character is a Rebel. The Main Character has specific Characteristics that define them. Do not list any options in the Intro.

// Main Character (the reader): You will serve as a key to build, converse and grow within the universe. Left to pick up the pieces of our past, we call upon you, citizens, to forge whatever future is left for us.

// Main Character Characteristics: ${xCHARS}

// State of World: Post-apocalyptic Neo Tokyo. Ghouls and uprisings abound. Dangerous, poisonous red mist lurks in the air.

// Plot: The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely, there will be much risk. You and your team's lives depends on it.

// Intro:
// `;

const INITPROMPT = `
  You are the main character in this mission.

  Mission Briefing:
  The infiltration operation is live, Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely — there will be much risk. You and your team's lives depend on it.

  Instructions:
  Begin the story with a tense and immersive scene that follows the mission briefing above. Use the character's abilities and gear in the action. Include relevant lore naturally (e.g., ghoul behavior, Karoshi tech, mist conditions). Do not ask the user questions.
`;

function parseOptions(text) {
  try {
    const data = JSON.parse(text);
    if (data.Option1 && data.Option2) return data;
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const data = JSON.parse(match[0]);
        if (data.Option1 && data.Option2) return data;
      } catch (_) {}
    }
  }

  const opt1 = text.match(/Option\s*1\s*[:\-]\s*(.+)/i);
  const opt2 = text.match(/Option\s*2\s*[:\-]\s*(.+)/i);
  if (opt1 && opt2) {
    return {
      Option1: opt1[1].trim().replace(/^"|"$/g, ''),
      Option2: opt2[1].trim().replace(/^"|"$/g, ''),
    };
  }
  return null;
}

function xgenerate(prompt) {
  console.log('_____generating....______');
  return openai.responses.create({
    model: 'o4-mini',
    input: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
}

function buildPrompt(storyState) {
  // const storyState = {
  //   storySoFar: content,
  //   choices: [],
  // };
  // @todo setup this format
  const storySummary = storyState.storySoFar;
  // const storySummary = storyState.storySoFar.join('\n');
  const lastChoice = storyState.choice;

  console.log('...story', storySummary);
  console.log('...choice', lastChoice);

  return `
    Main Character: ${CHARACTER_STRING}

    Story so far:
    ${storySummary}

    ${lastChoice ? `Last choice: ${lastChoice}` : ``}}

    Continue the story, making sure to reflect the main character's abilities, gear, and personality in the scene. 
    
    Return ONLY a single valid JSON object and nothing else.
    
    Important:
    - Escape all newlines as \n
    - Escape all double quotes inside strings as \"
    - Do NOT include Markdown, extra formatting, or newlines outside the string
    - Respond with valid JSON that can be parsed by JSON.parse()

    Use this exact structure:
    {
      "scene": "The scene here, use '\n' to indicate line breaks in this string. Do NOT add actual line breaks or formatting.",
      "choices": {
        "A": "First choice text",
        "B": "Second choice text"
      }
    }
  `;
}

function parseJSONResponse(response) {
  console.log(response);
  try {
    const parsed = JSON.parse(response);
    return {
      scene: parsed.scene,
      choices: parsed.choices,
    };
  } catch (err) {
    throw new Error('Failed to parse GPT response as JSON');
  }
}

const getNextStoryScene = async (storyState) => {
  // const storyState = {
  //   storySoFar: content,
  //   choices: [],
  // };
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildPrompt(storyState) }, //@todo playerstate
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
};

const simpleGenerate = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
};

const handler = async (req, res) => {
  if (req.method !== 'POST')
    return res.status(405).json({ message: `must use POST` });

  console.log('_____starting story gen______');
  let { init, content, choice } = req.body;
  if (init) content = INITPROMPT;
  // let content = INIT ? INITPROMPT : DATA.content;
  const storyState = {
    storySoFar: content,
    choice,
  };

  // if (!init) {
  //   content = `Continue the existing story below and write the next scene (3 paragraphs maximum) based off the Main Character's Last Decision. Remember to keep in mind the Main Character's Characteristics when writing the next scene:

  //     ${content}

  //     Main Character Characteristics: ${xCHARS}

  //     Next Scene:
  //     `;
  // }

  const generation = await getNextStoryScene(storyState);
  const parsed = parseJSONResponse(generation);
  // const GENERATION = await generate(content);
  // const REPLY = GENERATION.output_text;
  // const TRANSFORMED = await transformations(REPLY);

  let ending = false;
  if (!init) {
    const ENDING_PROMPT = `Based off the Previous story Scene, was the main objective of retrieving the enemy intel met, did the user obtain the intel or do they still have to choose? Only reply with YES or NO.
        
        Previous Scene: ${parsed.scene}
        `;

    const check = await simpleGenerate(ENDING_PROMPT);
    console.log('check::::::::', check);
    ending = check === 'YES';
  }

  // let choices;
  //   if (!ending || !init) {
  //     const CHOICESPROMPT = `Take the scene below and craft two short next-step choices.
  // Return ONLY a JSON object in this exact format:
  // {"Option1":"<10 words or less>","Option2":"<10 words or less>"}
  // Do not include any other text or formatting.

  // Scene: ${TRANSFORMED}`;

  //     let attempts = 0;
  //     let parsed = null;
  //     while (!parsed && attempts < 5) {
  //       const DATA = await generate(CHOICESPROMPT);
  //       const text = DATA.output_text.trim();
  //       parsed = parseOptions(text);
  //       attempts++;
  //     }
  //     choices = parsed;
  //   }

  const IMG_PROMPT = `Describe the environment, overall scene and what action is occurring for an image prompt generation. Depict the Main Character performing the action. 100 words maximum. No periods.
  Scene: ${parsed.scene}
  Main Character: ${CHARACTER_STRING}
  Action: ${choice}
  `;
  // const DESCRIBERS = `award-winning photo realism anime style, Cinematic lighting, mid-action pose, dynamic angle`;
  let IMG_PROMPT_GEN = await simpleGenerate(IMG_PROMPT);
  IMG_PROMPT_GEN += `Main Character Traits: [${CHARACTER_STRING}]`;
  console.log('img:::::', IMG_PROMPT_GEN);

  console.log('_____end story gen______');
  return res.status(200).json({
    output: parsed.scene,
    outputOptions: parsed.choices || {},
    ending: ending,
    imagePrompt: IMG_PROMPT_GEN,
  });
};

export default handler;
