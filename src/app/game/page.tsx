'use client'

import WordSearchGrid from "@/components/WordSearchGrid"
import { useEffect, useState } from "react";

async function getWords() {
    const res = await fetch('http://localhost:3000/api/words')

    return res.json()
}

export const dynamic = 'force-dynamic'
export default function Game(){

    let [words,setWords] = useState<string[]>(['hero','better','amazing','epic'])
    const [foundWords,updateFoundWords] = useState<string[]>([]);


    const testLetters = [
        ['a','b','c','d','e','f','g','h','i','j'],
        ['k','l','m','n','o','p','q','r','r','t'],
        ['u','v','h','e','r','o']
    ]




    return (
        <>
        <header >
            <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
        </header>
            <main className='grow flex flex-col justify-center items-center'>
                <section className="grow bg-red-100 flex justify-center items-center">
                    <WordSearchGrid  updateFound={updateFoundWords} words={words} length={10} letters={testLetters}/>
                </section>
                <section className="grow-[2] border w-[50%] flex gap-[10px] justify-center items-center">
                    {
                        words.map((word: string) => <p className={`flex flex-wrap justify-center text-gray-500 text-2xl ${foundWords.includes(word) && 'line-through'}`} >{word.toUpperCase()}</p>)
                    }
                </section>
            </main>
        </>
    )
}