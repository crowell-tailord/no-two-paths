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
                <p>Welcome to No Two Paths (v1.5)!</p>
                <p>This is a beta project built by <a href="https://twitter.com/iam_cro" target="_blank">@crowexx</a>. Updates will be made daily as part of the <a href="https://twitter.com/_buildspace" target="_blank">@buildspace</a> s4 class.</p>
                <p>Currently, the story you'll play has a pre-defined starting point, as well as a pre-defined character. However, once you start the story the options presented to you are all dynamic and unique <em>to you</em>. You will control what you'd like to do in the story.</p>
                <p>If you ever get stuck, feel free to just hit the start over button to clear the screen.</p>
                <p>Story &amp; image generation can sometimes take ~1min... but a small notification sound will ding to let you know when the scene is done :)</p>
                <p>If you're interested in this exact pre-defined storyline, it was actually derived from the <a href="https://twitter.com/thetokyorebels" target="_blank">@Tokyo Rebels</a> NFT project which is still very much active. I took the basis from a puzzle we created there and used it as a starting point here (the profile you see in the game is one of the Rebels!).</p>
                <div onClick={() => handleClose()} className="rotate-45 absolute top-2 right-4 text-xl font-bold cursor-pointer">+</div>
            </div>
        </div>
    )
}

export default Popup;