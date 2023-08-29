'use client'

/*
....2x23■■
.....crøwexx
⌙ displays the NFT image and attrs
*/

import { useState, useEffect } from 'react';
import Image from 'next/image';
import data from '~/data/rebel211.json'

const NFTdeets = () => {
    const [gifURL, setGifURL] = useState();
    const gif = 'https://ipfs.io/ipfs/' + data.animation_url;
    // console.log(gif)
    // useEffect(() => {
    //     fetch(gif).then((res) => res.blob()).then((blob) => {
    //         setGifURL(URL.createObjectURL(blob));
    //     })

    // }, [])

    return (
        <section className="border border-dotted p-1 bg-black w-[160px] overflow-scroll">
            <Image src='/i/rebel-211.gif' width={150} height={150} alt="who cares" style={{ width: '150px', height: '150px' }} />
            <div className="pt-2"><a href="https://opensea.io/assets/ethereum/0xb54420149dbe2d5b2186a3e6dc6fc9d1a58316d4/211" target="_blank">@Rebel #211</a></div>
            <div className="xflex flex-col flex-wrap basis-3/5 gap-x-4 xmax-h-[150px] text-xs pt-2">
                {data.attributes.map((d, i) => {
                    return <p key={i} className="pb-1">{d.trait_type}: <br /><span className="whitespace-normal text-red-600 font-mono">{d.value}</span></p>
                })}
            </div>
            {/* <Image src='https://www.tokyorebels.io/images/hunt-1-story-images/stairway.jpg' width={450} height={150} alt="who cares2" style={{ height: '150px' }} /> */}
        </section>
    )
}

export default NFTdeets;