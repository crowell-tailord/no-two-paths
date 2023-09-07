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

const Story = () => {
    const [loading, setLoading] = useState(false)
    const [storyLine, setStoryLine] = useState([]);
    const [options, setOptions] = useState([]);
    const [choices, setChoices] = useState([])
    const [step, setStep] = useState(1)
    const [end, setEnd] = useState(false)
    const [thankyou, setThankyou] = useState(false)

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
        const { output, outputOptions, ending } = DATA;
        setOptions([...options, outputOptions])
        setEnd(ending)
        setStoryLine([...storyLine, output])
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
        <section id="story" className="text-justify py-5 w-[70%] mx-[auto] max-h-[70vh] overflow-scroll">
            <p>The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. Your objective is to get inside the compound and retrieve the enemy intel. Make your decisions wisely, there will be much risk. You and your team's lives depends on it.</p>
            <br />
            {storyLine && storyLine.map((s, i) => {
                return <div key={`scene-${i}`} id={`scene-${i}`}>
                    <Break />
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

            {storyLine.length > 0 && <p onClick={handleReset} className="cursor-pointer text-xs">🔄 Clear &amp; Restart</p>}

            {loading && <center id="loader" className="relative my-4 mb-[100px] w-full text-xs">
                [writing scene]
                <FancyLoader />
            </center>}
        </section>
    )
}

export default Story;