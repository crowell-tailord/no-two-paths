"use client"

/*
....2x23■■
.....crøwexx
⌙ does cool things
*/

import { useState } from 'react'
import Script from 'next/script'
import Header from '~/layout/Header';
import Footer from '~/layout/Footer';
import NFTdeets from '~/components/NFTdeets';
import Story from '~/components/Story';
import Popup from '~/components/Popup';

export default function Page() {
  const [show, setShow] = useState(true);

  return (
    <div className="text-white bg-[url('/i/bg-wide.jpeg')] bg-center bg-cover min-h-screen">
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
      <div className="flex flex-col items-center p-24 pb-0">
        <main className="flex w-3/4 bg-black/80 backdrop-blur-sm max-h-[70vh]">
          <NFTdeets />
          <Story />
        </main>
      </div>
      <Footer />
      {show && <Popup action={setShow} />}
    </div>
  )
}
