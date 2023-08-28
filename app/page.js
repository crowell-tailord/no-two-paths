"use client"

/*
....2x23■■
.....crøwexx
⌙ does cool things
*/

import { useState } from 'react'
import Header from '~/layout/Header';
import Footer from '~/layout/Footer';
import NFTdeets from '~/components/NFTdeets';
import Story from '~/components/Story';
import Popup from '~/components/Popup';

export default function Page() {
  const [show, setShow] = useState(true);

  return (
    <div className="bg-[url('/i/bg-wide.jpeg')] bg-center bg-cover min-h-screen">
      <Header />
      <div className="flex flex-col items-center p-24 pb-0">
        <h1 className="">No Two Paths</h1>
        <main className="flex w-3/4 bg-black/80 backdrop-blur-sm max-h-[70vh] border border-sky-400 border-dotted">
          <NFTdeets />
          <Story />
        </main>
      </div>
      <Footer />
      {show && <Popup action={setShow} />}
    </div>
  )
}
