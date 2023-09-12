import { TNL } from 'tnl-midjourney-api';
import { NextResponse } from "next/server";

const KEY = process.env.TNL_API_KEY;
const tnl = new TNL(KEY);

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function POST(req) {
    const DATA = await req.json();
    const response = await tnl.imagine(DATA);
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
        0,
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
