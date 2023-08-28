/*
....2x23■■
.....crøwexx
⌙ the *ai*
*/

import { NextResponse } from "next/server";
import OpenAI from 'openai';
import transformations from '~/func/transformations'

const OPENAI = new OpenAI();

const ATTRS = `"Class: Rebel","Gender: Female","Background: Kuebiko Workshop","Weapon: Bo Staff (Fire)","Skin: Coral","Tattoo: Cherry","Eyes: Feminine Neutral (Fire)","Mouth: Smirk","Hair: Short (Acid)","Clothes: Headphones","Mask: Gasmask (Acid)","Eyewear: Punk (Acid)"`

const INITPROMPT = `Write me the first two paragrahps of a Choose Your Own Adventure style story. The Main Character is a Rebel. The Main Character has specific Attributes that define them. Do not list any options in the Intro.

Main Character (the reader): You will serve as a key to build, converse and grow within the universe. Left to pick up the pieces of our past, we call upon you, citizens, to forge whatever future is left for us.

Main Character Attributes: ${ATTRS}

Plot: The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. It looks as if they have captured some of our comrades. Try to bring them back alive, but remember objective #1 is to get inside the compound. Make your decision wisely, there will be much risk. You and your team's lives depends on it.

Intro:
`

export async function POST(req) {
    const DATA = await req.json();
    let content = DATA === 'init' ? INITPROMPT : DATA;
    if (content != 'init') {
        // console.log("STORY SO FAR \n\n", content)
        content = `Continue the existing story below and write the next scene (3 paragraphs maximum) based off the Main Character's Last Decision. Remember to keep in mind the Main Character's Attributes when writing the next scene:
        
        ${content}

        Main Character Attributes: ${ATTRS}

        Next Scene:
        `
    }
    const GENERATION = await OPENAI.chat.completions.create({
        // const generation = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user',
            content: content
        }]
    })

    const REPLY = await GENERATION.choices[0].message.content;
    const TRANSFORMED = await transformations(REPLY);

    const CHOICESPROMPT = `Take the scene below and generate 2 optional next steps in JSON format for the Main Character. 10 words maximum for each option. Each JSON object key should be like "Option1", "Option2", etc.
    
    Scene: ${TRANSFORMED}
    `

    const GENERATION_CHOICES = await OPENAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user',
            content: CHOICESPROMPT
        }]
    })
    // str.split(':').pop().split(';')[0];
    const CHOICES = await GENERATION_CHOICES.choices[0].message.content;
    // console.log(CHOICES)
    // console.log('-------')
    // const CHOICES_ARR = CHOICES.split(':');
    const CHOICES_OBJ = {};
    // CHOICES.forEach((c, i) => {
    //     if (i % 2 === 1) {
    //         CHOICES_OBJ[`option${i}`] = c.trim()
    //     }
    // })
    // {
    //     'option1': CHOICES_ARR[0].split('Option 1:')[1].trim(),
    //     'option2': CHOICES_ARR[1].trim()
    // }

    return NextResponse.json(
        {
            output: TRANSFORMED,
            options: JSON.parse(CHOICES)
        },
        { status: 200 }
    );
}