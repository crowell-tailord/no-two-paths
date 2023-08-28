import { useState } from 'react';

const Popup = ({ action }) => {
    const [animate, setAnimate] = useState('');

    const handleClose = async () => {
        setAnimate('animate-close');
        setTimeout(() => {
            action(false)
        }, 300);
    }

    return (
        <div className={'fixed inset-0 bg-black/70 flex justify-center items-center backdrop-blur-sm ' + animate}>
            <div className="bg-black p-4 w-[50%] min-w-[300px] border border-dotted relative popup-content">
                <center>Hello there...</center>
                <p>Welcome to No Two Paths!</p>
                <p>This is a beta project built by <a href="https://twitter.com/iam_cro" target="_blank">@crowexx</a>. Updates will be made daily as part of the <a href="https://twitter.com/_buildspace" target="_blank">@buildspace</a> s4 class.</p>
                <p>Currently, the story you'll play has a pre-defined starting point, as well as a pre-defined character. However, once you start the story the options presented to you are all dynamic and unique <em>to you</em>. You will control what you'd like to do in the story.</p>
                <p>As of now, there is no 'end' to the story, so, after several scenes you may find the story getting a little dragged out (not really any point to the options any more). Feel free to just hit the start over button at that point 😅.. or not and just keep seeing where the story takes you! (However the AI may crap out and you might get an indefinite 'writing...' message.)</p>
                <p>If you're interested in this exact pre-defined storyline, it was actually derived from the <a href="https://twitter.com/thetokyorebels" target="_blank">@Tokyo Rebels</a> NFT project which is still alive and kicking. I took the basis from a puzzle we created there and used it as a starting point here (the profile you see in the game is one of the Rebels!).</p>
                <div onClick={() => handleClose()} className="rotate-45 absolute top-2 right-4 text-xl font-bold cursor-pointer">+</div>
            </div>
        </div>
    )
}

export default Popup;