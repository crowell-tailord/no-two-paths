/*
....2x23■■
.....crøwexx
⌙ displays the NFT image and attrs
*/

import { useState } from 'react';
import Image from 'next/image';
import data from '~/data/rebel211.json'

const NFTdeets = () => {
    const [open, setOpen] = useState(false);
    const [gifURL, setGifURL] = useState();
    const gif = 'https://ipfs.io/ipfs/' + data.animation_url;
    // console.log(gif)
    // useEffect(() => {
    //     fetch(gif).then((res) => res.blob()).then((blob) => {
    //         setGifURL(URL.createObjectURL(blob));
    //     })

    // }, [])


    return (
        <section id="nft-deets" className={"border border-dotted p-1 bg-black w-[160px] xmax-h-[400px] h-[200px] overflow-hidden [transition:all_300ms_ease] " + (open && '!h-[400px]')}>
            <Image src='/i/rebel-211.gif' width={150} height={150} alt="who cares" style={{ width: '150px', height: '150px' }} />
            <div className="pt-2 flex justify-between">
                <a href="https://opensea.io/assets/ethereum/0xb54420149dbe2d5b2186a3e6dc6fc9d1a58316d4/211" target="_blank">@Rebel #211</a>
                <span className="cursor-pointer underline" onClick={() => setOpen(!open)}>{open ? 'close' : 'traits'}</span>
            </div>
            <div className="xflex flex-col flex-wrap basis-3/5 gap-x-4 xmax-h-[150px] text-xs pt-2 overflow-scroll h-[200px]">
                {data[0].attributes.map((d, i) => {
                    return <p key={i} className="pb-1">{d.trait_type}: <br /><span className="whitespace-normal text-red-600 font-mono">{d.value}</span></p>
                })}
            </div>
        </section>
    )
}

export default NFTdeets;