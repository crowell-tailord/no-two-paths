/*
....2x23■■
.....crøwexx
⌙ main story builder
*/

import Image from 'next/image';
import { useState, useEffect } from 'react';
import FancyLoader from '~/components/FancyLoader'

const Button = ({ children, action, className, disabled }) => (
    <button className={'border border-white px-4 mb-2 block ' + className + (disabled ? ' opacity-30' : ' hover:bg-white hover:text-black')} onClick={action} disabled={disabled}>{children}</button>
)

const Break = () => (<center className="mb-5">* * * * *</center>);

const LoadingImage = () => (<div className="flex justify-center w-full h-[200px] border border-white overflow-hidden items-center animate-loading">[loading image...]</div>)

const Story = () => {
    const [started, setStarted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [storyLine, setStoryLine] = useState([]);
    const [choices, setChoices] = useState([]);
    const [options, setOptions] = useState([]);
    const [nextStoryLine, setNextStoryLine] = useState([])
    const [holdingChoice, setHoldingChoice] = useState(null)
    const [step, setStep] = useState(1)
    const [end, setEnd] = useState(false)
    const [thankyou, setThankyou] = useState(false)
    const [images, setImages] = useState([])
    const [broke, setBroke] = useState(false)
    // https://cdn.midjourney.com/437305b4-5208-408c-bbcc-7cfe67eeb8b9/0_0.png

    useEffect(() => {
        !started && generate('init')
    }, [])

    useEffect(() => {
        if (loading) {
            setLoading(false)
        }
    }, [storyLine])

    useEffect(() => {
        started && trackInit()
        if (!storyLine.length & started) {
            setLoading(true);
        }
    }, [started])

    useEffect(() => {
        console.log('the next segmentss', nextStoryLine)
        //skip the first story line creation
        if (holdingChoice != null && nextStoryLine.length === 2) {
            selectChoice(holdingChoice)
            setLoading(false)
            setHoldingChoice(null)
        }
    }, [nextStoryLine])

    useEffect(() => {
        // started && scrollStory()
        if (loading) {

        }
    }, [loading])

    const handleReset = () => {
        setStoryLine([])
        setOptions([])
        setChoices([])
        setEnd(false)
        setLoading(false)
        setThankyou(false)
        setStarted(false)
        setNextStoryLine([])
        setHoldingChoice(null)
        setStep(1)
        setImages([])
    }

    const generate = async (body) => {
        // setLoading(true);
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: body })
        });
        const DATA = await response.json();
        const { output, outputOptions, ending, imagePrompt } = DATA;
        if (!outputOptions.Option1) {
            setBroke(true);
            return;
        }

        if (body === 'init') {
            setOptions([...options, outputOptions])
            setStoryLine([...storyLine, output])
            Object.keys(outputOptions).map(i => {
                handleChoice(outputOptions[i])
            })
            //delay image gen for after setting these ^
            const image = await generateImage(imagePrompt)
            setImages([...images, image])
        } else {
            const image = await generateImage(imagePrompt)
            const nextSegment = {
                story: output,
                options: outputOptions,
                image: image
            }
            //need to pass prev state to avoid asyncronous overwriting!
            setNextStoryLine((prevNextStoryLine) => [...prevNextStoryLine, nextSegment]);
            setEnd(ending)
        }


        // const notif = new Audio('/notif.m4a');
        // notif.volume = 0.5;
        // started && notif.play()

        // setLoading(false)
    }

    const generateImage = async (body) => {
        const IMGRESP = await fetch('/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(`${body} anime style graphic --niji --ar 7:4 --q .25`)
        });
        const IMGDATA = await IMGRESP.json();
        const { image } = IMGDATA;
        console.log(image)
        return image;
    }

    const handleChoice = (choice, set) => {
        const BODY = `${storyLine} \n\n Last Decision: ${choice}`
        generate(BODY)
        // setChoices([...choices, choice])
        // setStep(step + 1)
    }

    const selectChoice = (choice) => {
        //either 0 or 1
        if (!nextStoryLine.length) {
            setLoading(true);
            setHoldingChoice(choice)
            return;
        }
        const NEXTLINE = nextStoryLine[choice];
        setNextStoryLine([])
        setOptions([...options, NEXTLINE.options])
        setStoryLine([...storyLine, NEXTLINE.story])
        setImages([...images, NEXTLINE.image])
        // console.log(outputOptions)
        Object.keys(NEXTLINE.options).map(i => {
            handleChoice(NEXTLINE.options[i])
        })
        setStep(step + 1)
    }

    const checkForStory = () => {

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

    const trackInit = () => {
        window.gtag('event', 'start story');
    }

    if (broke) {
        return (
            <section id="story" className="text-justify md:w-[740px] md:h-[100vh] md:overflow-scroll backdrop-blur-md p-8 bg-black/60">
                So sorry! The game broke itself, just refresh the page to start again please!
            </section>
        )
    }

    return (
        <section id="story" className="text-justify md:w-[740px] md:h-[100vh] md:overflow-scroll backdrop-blur-md p-8 bg-black/60">
            <p>The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely, there will be much risk. You and your team's lives depends on it.</p>
            <br />
            {started && storyLine && storyLine.map((s, i) => {
                return <div key={`scene-${i}`} id={`scene-${i}`}>
                    <Break />
                    {images[i] ? <img src={images[i]} width={740} className="border border-white" /> : <LoadingImage />}
                    {/* {images[i] ? <Image src={images[i]} width={740} height={420} alt={`storyimage-${i}`} quality={60} className="border border-white" /> : <LoadingImage />} */}
                    <p className="text-justify mb-5 whitespace-pre-wrap">
                        {s}
                        <br />
                        <span className="text-red-600">/{i + 1}</span>
                    </p>
                    <div className="m-2 p-4">
                        {Object.keys(options[i]).map((c, j) => {
                            return <Button key={`options-${i}-${j}`} action={() => selectChoice(j)} className={(choices[i] === options[i][c] ? "text-red-600 !border-red-600 opacity-80 choice " : "") + "text-left"} disabled={loading || step != i + 1}>{options[i][c]}</Button>;
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

            {!started && <div className="flex justify-center m-2 p-4 gap-x-2">
                <Button action={() => setStarted(true)}>✨ Start Story</Button>
            </div>}

            {loading && started && <center id="loader" className="relative my-4 mb-[100px] w-full text-xs">
                [writing scene]
                <FancyLoader />
            </center>}

            {storyLine.length > 0 && started && <span onClick={handleReset} className="cursor-pointer text-xs">🔄 Clear &amp; Restart</span>}
        </section>
    )
}

export default Story;