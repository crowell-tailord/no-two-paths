"use client"

/*
....2x23■■
.....crøwexx
⌙ does cool things
*/

import { useState } from 'react'
import Script from 'next/script'
import Header from '~/layout/Header';
import NFTdeets from '~/components/NFTdeets';
import Story from '~/components/Story';
import Popup from '~/components/Popup';

export default function Page() {
  const [show, setShow] = useState(true);

  return (
    <div className="text-white bg-black bg-[url('/i/bg-wide.jpeg')] bg-center bg-cover bg-fixed min-h-screen">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q1T2LS6Y94" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-Q1T2LS6Y94');
        `}
      </Script>
      <Header />
      <div className="md:flex flex-col items-center">
        <main className="md:flex md:w-3/4 justify-center">
          <NFTdeets />
          <Story />
        </main>
      </div>
      {show && <Popup action={setShow} />}
    </div>
  )
}
