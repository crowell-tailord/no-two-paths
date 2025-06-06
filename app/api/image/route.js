import { TNL } from 'tnl-midjourney-api';
import { NextResponse } from "next/server";

const KEY = process.env.TNL_API_KEY;
const tnl = new TNL(KEY);

const CHARACTER = `Main female Character with her fiery bo staff, who has coral colored skin and a cherry tattoo, her eyes are fiery and a smirk on her face, short acid colored hair fluttering in the wind, wearing headphones and a acid colored gasmask and punk-styled, spiked acid colored goggles`
const PROMPTS = `--ar 7:4 --q .25 --niji`
const DESCRIBERS = `Anime style graphic, high contrast lighting, warm tones, colorful palete, award-winning`

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function POST(req) {
    const ENVIRONMENT_EVENT = await req.json();
    const PROMPT = `digital painting of ${ENVIRONMENT_EVENT} and the ${CHARACTER} is in the scene, ${DESCRIBERS} ${PROMPTS}`
    const response = await tnl.imagine(PROMPT);
    const MSGID = response.messageId;

    const fetchToCompletion = async (messageId, retryCount, maxRetry = 20) => {
        const MSG = await tnl.getMessageAndProgress(messageId);
        if (MSG.progress === 100) {
            return MSG;
        }
        if (MSG.progress === 'incomplete') {
            throw new Error('Image generation failed');
        }
        if (retryCount > maxRetry) {
            throw new Error('Max retries exceeded');
        }
        if (MSG.progress && MSG.progressImageUrl) {
            console.log('---------------------');
            console.log(`Progress: ${MSG.progress}%`);
            console.log(`Progress Image Url: ${MSG.progressImageUrl}`);
            console.log('---------------------');
        }

        await sleep(3000);
        return fetchToCompletion(messageId, retryCount + 1);
    };

    const completedImageData = await fetchToCompletion(
        MSGID,
        2,
    );

    console.log('\n=====================');
    console.log('COMPLETED IMAGE DATA');
    console.log(completedImageData);
    console.log('=====================');

    const IMG = completedImageData.response.imageUrls[0];



    return NextResponse.json(
        {
            image: IMG
        },
        { status: 200 }
    );
}
