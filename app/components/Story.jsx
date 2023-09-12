/*
....2x23■■
.....crøwexx
⌙ main story builder
*/

import { useState, useEffect } from 'react';
import FancyLoader from '~/components/FancyLoader'
// import story from '~/data/huntOneStory.json'

const Button = ({ children, action, className, disabled }) => (
    <button className={'border border-white px-4 mb-2 block ' + className + (disabled ? ' opacity-30' : ' hover:bg-white hover:text-black')} onClick={action} disabled={disabled}>{children}</button>
)

const Break = () => (<center className="mb-5">* * * * *</center>);

const LoadingImage = () => (<div className="flex justify-center w-full h-[200px] border border-white overflow-hidden items-center animate-loading">[loading image...]</div>)

const Story = () => {
    const [loading, setLoading] = useState(false)
    const [storyLine, setStoryLine] = useState([]);
    const [options, setOptions] = useState([]);
    const [choices, setChoices] = useState([])
    const [step, setStep] = useState(1)
    const [end, setEnd] = useState(false)
    const [thankyou, setThankyou] = useState(false)
    const [images, setImages] = useState([])
    // https://cdn.midjourney.com/437305b4-5208-408c-bbcc-7cfe67eeb8b9/0_0.png

    useEffect(() => {
        scrollStory()
    }, [loading])

    const handleReset = () => {
        setStoryLine([])
        setOptions([])
        setChoices([])
        setEnd(false)
        setLoading(false)
        setThankyou(false)
    }

    const generate = async (body) => {
        setLoading(true);
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: body })
        });
        const DATA = await response.json();
        const { output, outputOptions, ending, imagePrompt } = DATA;
        setOptions([...options, outputOptions])
        setEnd(ending)
        setStoryLine([...storyLine, output])
        const IMGRESP = await fetch('/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(`${imagePrompt} anime style graphic --niji --ar 7:4 --q .25`)
        });
        const IMGDATA = await IMGRESP.json();
        const { image } = IMGDATA;
        // const IMAGE = await generateImage(IMGPROMPT);
        setImages([...images, image])
        const notif = new Audio('/notif.m4a');
        notif.play()
        setLoading(false)
    }

    const handleChoice = (choice, set) => {
        const BODY = `${storyLine} \n\n Last Decision: ${choice}`
        generate(BODY)
        setChoices([...choices, choice])
        setStep(step + 1)
    }

    const scrollStory = () => {
        const STORYDIV = document.getElementById('story');
        const LOADERDIV = document.getElementById('loader')
        const SCENEDIV = document.getElementById(`scene-${step - 1}`)
        STORYDIV.scrollTo({
            top: loading ? LOADERDIV.offsetTop : SCENEDIV?.offsetTop,
            behavior: 'smooth'
        })
    }

    const poll = (t) => {
        window.gtag('event', t)
        setThankyou(true)
    }

    return (
        <section id="story" className="text-justify w-[740px] h-[100vh] overflow-scroll backdrop-blur-md p-8 bg-black/60">
            <p>The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely, there will be much risk. You and your team's lives depends on it.</p>
            <br />
            {storyLine && storyLine.map((s, i) => {
                return <div key={`scene-${i}`} id={`scene-${i}`}>
                    <Break />
                    {images[i] ? <img src={images[i]} width={740} className="border border-white" /> : <LoadingImage />}
                    <p className="text-justify mb-5 whitespace-pre-wrap">
                        {s}
                        <br />
                        <span className="text-red-600">/{i + 1}</span>
                    </p>
                    <div className="m-2 p-4">
                        {Object.keys(options[i]).map((c, j) => {
                            return <Button key={`options-${i}-${j}`} action={() => handleChoice(options[i][c])} className={(choices[i] === options[i][c] ? "text-red-600 !border-red-600 opacity-80 choice " : "") + "text-left"} disabled={loading || step != i + 1}>{options[i][c]}</Button>;
                        })}
                    </div>
                </div>
            })}

            {end &&
                <div>
                    <center>Congrats on finishing!</center>
                    <br />
                    <center>Here were your choices:</center>
                    <div className="border border-white p-2 my-2">
                        <ul>
                            {choices.map((c, i) => {
                                return <li key={`choices-${i}`}>⌙ {c}</li>
                            })}
                        </ul>
                    </div>
                    <p className="mt-4 mb-2">Do you feel like you successfully completed the mission or did it end too early?</p>
                    <div className="flex justify-center m-2 p-4 gap-x-2">
                        {!thankyou && <>
                            <Button action={() => poll('yes gud')}>Yes</Button>
                            <Button action={() => poll('nar bad')}>No</Button>
                        </>}
                        {thankyou && <p>Thanks for your feedback!</p>}
                    </div>
                    <Break />
                </div>
            }

            {!loading && !storyLine.length && <div className="flex justify-center m-2 p-4 gap-x-2">
                <Button action={() => generate('init')}>✨ Start Story</Button>
            </div>}

            {loading && <center id="loader" className="relative my-4 mb-[100px] w-full text-xs">
                [writing scene]
                <FancyLoader />
            </center>}

            {storyLine.length > 0 && <span onClick={handleReset} className="cursor-pointer text-xs">🔄 Clear &amp; Restart</span>}
        </section>
    )
}

export default Story;