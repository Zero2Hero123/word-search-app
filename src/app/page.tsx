'use client'

import Link from "next/link";

import { useEffect, useState } from "react"
export default function Home() {

  const [length,setLength] = useState<number>(10);

  async function getData(){
    // get data here
  }

  useEffect(() => {
    getData()
  })

  return (
    <>
      <header >
        <p className="text-center text-blue-400">Welcome to</p>
        <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
      </header>
      <main className="grow flex justify-center items-center">
        <div className="flex flex-col justify-start items-center bg-gray-200 drop-shadow-md rounded-md w-[500px] h-[500px] px-5">
          <p className='text-2xl py-2 text-gray-500 text-center'>Settings</p>
          
          <p className="text-gray-500 text-xl">Dimensions: <input className='w-12' onChange={(e) => setLength(e.target.valueAsNumber)} type="number" min='8' max='12' value={length}/> letters by {length}</p>



          <Link href='/game'>
            <button className="bg-blue-500 text-white rounded-sm px-2 py-2 my-2 hover:bg-blue-400 transition-all">Start</button>
          </Link>
        </div>
      </main>
    </>
  )
}
