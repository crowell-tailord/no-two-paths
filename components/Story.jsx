/*
....2x25■■
.....crøwexx
⌙ main story builder
*/

import { useState, useEffect } from 'react';
import FancyLoader from 'components/FancyLoader'

const HEADERS = {'Content-Type':'application/json'};

const Button = ({ children, action, className, disabled }) => (
    <button className={'border border-white px-4 mb-2 block cursor-pointer ' + className + (disabled ? ' opacity-30' : ' hover:bg-white hover:text-black')} onClick={action} disabled={disabled}>{children}</button>
)

const Break = () => (<center className="mb-5">* * * * *</center>);

const LoadingImage = () => (<div className="flex justify-center w-full h-[200px] border border-white overflow-hidden items-center animate-loading">[loading image...]</div>)

// interface PlayerStoryState {
//   userId: string;
//   storySoFar: string[]; // Array of paragraph summaries
//   fullHistory: string[]; // Optional full logs
//   choices: {
//     step: number;
//     choice: 'A' | 'B';
//     prompt: string;
//     outcome: string;
//   }[];
//   currentStep: number;
// }

const Story = () => {
    const [broke, setBroke] = useState(false)
    const [choices, setChoices] = useState([]);
    const [end, setEnd] = useState(false)
    const [holdingChoice, setHoldingChoice] = useState(null)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [nextStoryLine, setNextStoryLine] = useState([])
    const [options, setOptions] = useState([]);
    const [started, setStarted] = useState(false)
    const [step, setStep] = useState(1)
    const [storyLine, setStoryLine] = useState([]);
    const [thankyou, setThankyou] = useState(false)
    // https://cdn.midjourney.com/437305b4-5208-408c-bbcc-7cfe67eeb8b9/0_0.png

    useEffect(() => {
        !started && generate('',true)
    }, [])

    // useEffect(() => {
    //     if (loading) {
    //         setLoading(false)
    //     }
    // }, [storyLine])

    useEffect(() => {
        started && trackInit()
        if (!storyLine.length & started) {
            setLoading(true);
        }
    }, [started])

    useEffect(() => {
        console.log('the next segments', nextStoryLine)
        //skip the first story line creation
        if (holdingChoice != null && nextStoryLine.length === 2) {
            selectChoice(holdingChoice)
            setLoading(false)
            setHoldingChoice(null)
        }
    }, [nextStoryLine])

    // useEffect(() => {
    //     // started && scrollStory()
    //     if (loading) {

    //     }
    // }, [loading])

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

    const generate = async (choice = null, init = false) => {
        setLoading(true);
        // const init = body === 'init';
        let storyObj = {};

        try {
            const response = await fetch('/api/storygen', {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({content:storyLine, choice, init})
            });
            storyObj = await response.json();
        } catch(e) {
            console.error((e.message))
        }

        const { output, outputOptions, ending, imagePrompt } = storyObj;
        
        if(!output || !outputOptions.A || !imagePrompt) {
            setBroke(true);
            console.error({output,outputOptions,imagePrompt})
            return;
        }
        
        setOptions([...options, outputOptions])
        setStoryLine([...storyLine, output])
        // if (init) {
        //     // Object.keys(outputOptions).map(i => {
        //     //     handleChoice(outputOptions[i])
        //     // })
        //     //delay image gen for after setting these ^
            const image = await generateImage(imagePrompt)
            setImages([...images, image])
        // } else {
        //     // const image = await generateImage(imagePrompt)
        //     const nextSegment = {
        //         story: output,
        //         options: outputOptions,
        //         // image: image
        //     }
        //     //need to pass prev state to avoid asyncronous overwriting!
        //     setNextStoryLine((prevNextStoryLine) => [...prevNextStoryLine, nextSegment]);
            setEnd(ending)
        // }

        // const notif = new Audio('/notif.m4a');
        // notif.volume = 0.5;
        // started && notif.play()

        setLoading(false);
    }

    const generateImage = async (body) => {
        try {
            const response = await fetch('/api/imagegen', {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(`${body}`)
            });
            const {image} = await response.json();
            return image;
        } catch(e) {
            console.error(JSON.stringify(e))
        }
    }

    const handleChoice = (choice, set) => {
        const BODY = `${storyLine} \n\n Last Decision: ${choice}`
        generate(storyLine)
        // setChoices([...choices, choice])
        // setStep(step + 1)
    }

    const selectChoice = choice => {
        // generate(`${storyLine} \n\n Last Decision: ${choice}`)
        const _choices = [...choices, choice];
        setChoices(_choices);
        generate(choice);
        setStep(step + 1);
    }

    const xselectChoice = (choice) => {
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
                    {images[i] ? <img src={`data:image/png;base64, ${images[i]}`} width={740} className="border border-white" /> : <LoadingImage />}
                    {/* {images[i] ? <Image src={images[i]} width={740} height={420} alt={`storyimage-${i}`} quality={60} className="border border-white" /> : <LoadingImage />} */}
                    <p className="text-justify mb-5 whitespace-pre-wrap">
                        {s}
                        <br />
                        <span className="text-red-600">/{i + 1}</span>
                    </p>
                    {!end && <div className="m-2 p-4">
                        {Object.keys(options[i]).map((c, j) => {
                            return <Button key={`options-${i}-${j}`} action={() => selectChoice(options[i][c])} className={(choices[i] === options[i][c] ? "text-red-600 !border-red-600 opacity-80 choice " : "") + "text-left"} disabled={loading || step != i + 1}>{options[i][c]}</Button>;
                        })}
                    </div>}
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