/*
....2x23■■
.....crøwexx
⌙ main story builder
*/

import { useState, useEffect } from 'react';
import FancyLoader from '~/components/FancyLoader'
import story from '~/data/huntOneStory.json'

const Button = ({ children, action, className, disabled }) => {
    return <button className={'border border-white px-4 mb-2 hover:bg-white hover:text-black block ' + className + (disabled ? ' opacity-30' : '')} onClick={action} disabled={disabled}>{children}</button>
}

const Break = () => (<center className="mb-5">* * * * *</center>);

const Story = () => {
    const [storyLine, setStoryLine] = useState([]);
    const [choices, setChoices] = useState([]);
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0);
    const [stepResult, setStepResult] = useState();
    const [next, setNext] = useState();
    const [oai, setOai] = useState();
    const [prompt, setPrompt] = useState();

    const handleNext = (n) => {
        n ? setNext(n - 1) : setNext(9999);
    }

    const handleReset = () => {
        setStoryLine([])
        setChoices([])
        setLoading(false)
    }

    const handleGenerate = async (choice) => {
        // console.log(choice)
        setLoading(true)
        const H = await scrollStory();
        // console.log(H, 'hiegh')
        let body = choice ? choice : 'init';
        if (choice) {
            body = `${storyLine} \n\n Last Decision: ${choice}`
        }
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const { output, options } = data;
        // console.log('api replied with ', output);
        // console.log('choices', options, typeof options)
        // console.log(choices)
        setOai(output)
        setStoryLine([...storyLine, output])
        setChoices([...choices, options])
        setLoading(false)
        scrollStory(H)
    }

    const scrollStory = async (h) => {
        // console.log('wtf')
        const DIV = document.getElementById('story');
        DIV.scrollTop = h ? h + 1500 : DIV.scrollHeight;
        return DIV.scrollHeight;
    }

    return (
        <section id="story" className="text-justify py-5 w-[70%] mx-[auto] max-h-[70vh] overflow-scroll">
            {/* <Break /> */}
            {/* <p>The infiltration operation is live Rebel. The defenses are strong, and there are ghoul hordes in the area. It looks as if they have captured some of our comrades. Try to bring them back alive, but remember objective #1 is to get inside the compound. Make your decision wisely, there will be much risk. You and your team's lives depends on it. What action will you take Hunter?</p> */}
            <br />
            {/* <p>Pick an action below to learn more before committing<span className="blinker">...</span></p> */}
            {storyLine && storyLine.map((s, i) => {
                return <div key={`scene-${i}`}>
                    <Break />
                    <p className="text-justify mb-5 whitespace-pre-wrap">
                        {s}
                        <br />
                        <span className="text-red-600">/{i + 1}</span>
                    </p>
                    <div className="m-2 p-4">
                        {Object.keys(choices[i]).map((c, j) => {
                            return <Button key={`choices-${i}-${j}`} action={() => handleGenerate(choices[i][c])} className="text-left" disabled={loading}>{choices[i][c]}</Button>;
                        })}
                    </div>
                </div>
            })}
            {!loading && !storyLine.length && <div className="flex justify-center m-2 p-4 gap-x-2">
                <Button action={() => handleGenerate()}>✨ Start Story</Button>
            </div>}
            {storyLine.length > 0 && <p onClick={handleReset} className="cursor-pointer text-xs">🔄 Clear &amp; Restart</p>}
            {loading && <center className="relative my-4 mb-[100px] w-full text-xs xanimate-ellipsis">
                writing scene
                <FancyLoader />
            </center>}
            {/* {storyLine && <>
                <p className="text-center mb-5">* * * * *</p>
                <div dangerouslySetInnerHTML={{ __html: story[storyLine].description }} />
                <p className="text-center mb-5">* * * * *</p>
                <div dangerouslySetInnerHTML={{ __html: story[storyLine]['steps'][step].text }} />
                <div className="flex flex-wrap gap-x-2 m-2 p-4">
                    {story[storyLine]['steps'][step]['choices'].map((c, i) => {
                        return <Button key={i} action={() => { setStepResult(c.results[0].text), handleNext(c.results[0].next) }}>{c.text}</Button>
                    })}
                </div>
                {stepResult && <p dangerouslySetInnerHTML={{ __html: stepResult }} />}
                {stepResult && next !== 9999 && <><br /><Button action={() => { setStep(next), setStepResult() }}>Continue</Button></>}
                {next === 9999 && <>
                    <p className="text-center mb-5">* * * * *</p>
                    <p>🁢: Your Hunt is over Rebel. Return to base.</p>
                    <br />
                    <Button action={() => handleReset()}>Restart</Button>
                </>}
            </>} */}
        </section>
    )
}

export default Story;