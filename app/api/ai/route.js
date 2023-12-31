/*
....2x23■■
.....crøwexx
⌙ the *ai*
*/

import { NextResponse } from "next/server";
import OpenAI from 'openai';
import transformations from '~/func/transformations'

const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'

const OPENAI = new OpenAI();

const CHARS = `"Class: Rebel","Gender: Female","Background: Kuebiko Workshop","Weapon: Bo Staff (Fire)","Skin: Coral","Tattoo: Cherry","Eyes: Feminine Neutral (Fire)","Mouth: Smirk","Hair: Short (Acid)","Clothes: Headphones","Mask: Gasmask (Acid)","Eyewear: Punk (Acid)"`

const INITPROMPT = `Write me the first two paragrahps of a Choose Your Own Adventure style story. The Main Character is a Rebel. The Main Character has specific Characteristics that define them. Do not list any options in the Intro.

Main Character (the reader): You will serve as a key to build, converse and grow within the universe. Left to pick up the pieces of our past, we call upon you, citizens, to forge whatever future is left for us.

Main Character Characteristics: ${CHARS}

State of World: Post-apocalyptic Neo Tokyo. Ghouls and uprisings abound. Dangerous, poisonous red mist lurks in the air.

Plot: The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely, there will be much risk. You and your team's lives depends on it.

Intro:
`

const IMGPROMPT = `A scene in Neo Tokyo that has been overrun with deadly red mist and in the center is an enemy base with a main front entrance guarded by ghouls, but off to the side is a secret entrance. Create this in an Anime style graphic.`

function generate(prompt) {
    return OPENAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user',
            content: prompt
        }]
    })
}

async function generateImage(prompt) {
    const img = await OPENAI.images.generate({
        prompt: prompt,
        size: "512x512"
    });
    return img.data[0].url
}

export async function POST(req) {
    const DATA = await req.json();
    const INIT = DATA.content === 'init' ? true : false;
    // console.log(DATA)
    let content = INIT ? INITPROMPT : DATA.content;
    if (!INIT) {
        // console.log("STORY SO FAR \n\n", content)
        content = `Continue the existing story below and write the next scene (3 paragraphs maximum) based off the Main Character's Last Decision. Remember to keep in mind the Main Character's Characteristics when writing the next scene:
        
        ${content}

        Main Character Characteristics: ${CHARS}

        Next Scene:
        `
    }
    const GENERATION = await generate(content);
    const REPLY = GENERATION.choices[0].message.content;
    const TRANSFORMED = await transformations(REPLY);

    // const IMGRESP = await fetch(`${baseUrl}/api/image`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(`A scene in Neo Tokyo that has been overrun with deadly red mist and in the center is an enemy base with a main front entrance guarded by ghouls, but off to the side is a secret entrance. Create this in an Anime style graphic --ar 7:4 --q .25`)
    // });
    // const IMGDATA = await IMGRESP.json();
    // const { image } = IMGDATA;


    let ending = false;
    if (!INIT) {
        const ENDING_PROMPT = `Based off the Previous story Scene, was the main objective of retrieving the enemy intel met? Only reply with YES or NO.
        
        Previous Scene: ${TRANSFORMED}
        `;

        const DATA = await generate(ENDING_PROMPT)
        ending = (DATA.choices[0].message.content === 'YES');
    }

    let choices;
    if (!ending || INIT) {
        const CHOICESPROMPT = `Take the scene below and generate 2 optional next steps in JSON format for the Main Character. 10 words maximum for each option. Each JSON object key should be like "Option1", "Option2", etc.
        
        Scene: ${TRANSFORMED}
        `

        let success = false;
        while (success === false) {
            let i = 0;
            const DATA = await generate(CHOICESPROMPT);
            choices = await DATA.choices[0].message.content;
            try {
                JSON.parse(choices)
            } catch (error) {
                console.error(error)
                i = 1;
            } finally {
                if (!i) { success = true }
            }
        }
    }

    const IMG_PROMPT_GEN = `Based off the Previous story Scene generate a prompt for AI image creation that portrays the scene.
        
    Previous Scene: ${TRANSFORMED}
    `;
    const IMG_PROMPT_GEN_DATA = await generate(IMG_PROMPT_GEN);
    const IMAGEPROMPT = await IMG_PROMPT_GEN_DATA.choices[0].message.content;

    return NextResponse.json(
        {
            output: TRANSFORMED,
            outputOptions: choices ? JSON.parse(choices) : {},
            ending: ending,
            imagePrompt: IMAGEPROMPT
        },
        { status: 200 }
    );
}