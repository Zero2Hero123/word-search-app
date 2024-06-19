'use client'

import Link from "next/link";

import { useEffect, useState, createContext } from "react"

import allWords from './words.json'

function generateWords(howMany: number): string[] {
  let newWords: string[] = []

  for(let i = 0; i<howMany; i++){
    let randomIdx = Math.round(Math.random() * allWords.filter(w => w.length > 2).length-1)

    newWords.push(allWords[randomIdx])
  }

  return newWords;
}

export default function Home() {

  const [length,setLength] = useState<number>(10);
  const [isRandom,setRandom] = useState<boolean>(true);
  const [words,setWords] = useState<string[]>(generateWords(length));

  useEffect(() => {
    if(isRandom){
      let newWords = generateWords(length)
      setWords([...newWords])
    } else {
      setWords([])
    }
  },[isRandom])

  useEffect(() => {
    sessionStorage.setItem('unused','')
    console.log(words)
  },[words])

  return (
    <>
      <header >
        <p className="text-center text-blue-400">Welcome to</p>
        <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
      </header>
      <main className="grow flex justify-center items-center">
        <div className="flex flex-col gap-1 justify-start items-center bg-gray-200 drop-shadow-md rounded-md w-[500px] h-[500px] px-5">
          <p className='text-2xl py-2 text-gray-500 text-center'>Settings</p>
          
          {/* <p className="text-gray-500 text-xl">Dimensions: </p>
          <span> <input className='outline-0 w-12' onChange={(e) => setLength(e.target.valueAsNumber)} type="number" min='8' max='12' value={length}/> letters by {length} </span> */}
          <p className="text-gray-500 text-xl">Words:</p>
          <select className="outline-0" onChange={(e) => setRandom((e.target.value == 'Random') ? true : false)}>
            <option value="Random" className="text-sm"> Random </option>  
            <option value="Custom" className="text-sm"> Custom </option>  
          </select> 

          {!isRandom && 
            <>
            <textarea minLength={5} onChange={e => setWords(e.target.value.split(',').map(w => w.trim()))} className="outline-0 p-4" id="" cols={20} rows={10}>
              
            </textarea>
            <p className="text-gray-500">Seperate each word by a comma: <span className='text-blue-500 text-3xl' >,</span></p>
            </>
          }



          
            <Link href={{pathname: '/game', query: {
              length: length,
              words: words.join(',')
            }}}>
              <button className="bg-blue-500 text-white rounded-sm px-2 py-2 my-2 hover:bg-blue-400 transition-all" >Start</button>
            </Link>
        </div>
      </main>
    </>
  )
}
