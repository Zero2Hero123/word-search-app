'use client'

import WordSearchGrid from "@/components/WordSearchGrid"
import { useRouter ,useSearchParams} from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

function generate2dGrid(words: string[]){
    let newGrid: string[] = []
}

export const dynamic = 'force-dynamic'
export default function Game(){
    const params = useSearchParams();

    let [words,setWords] = useState<string[]>([])
    const [foundWords,updateFoundWords] = useState<string[]>([]);

    const alphabet = [
        ['a','b','c','d','e','f','g','h','i','j'],
        ['k','l','m','n','o','p','q','r','r','t'],
        ['u','v','w','x','y','z']
    ]

    useEffect(() => {

        let paramWords = params.get('words') 
        if(paramWords){
            setWords(paramWords.split(','))
        } else {
            console.log('bruh, words not found')
        }
    },[])


    return (
        <>
        <header >
            <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
        </header>
            <main className='grow flex flex-col justify-center items-center'>
                <section className="grow flex justify-center items-center">
                    <WordSearchGrid  updateFound={updateFoundWords} words={words} length={10} letters={alphabet}/>
                </section>
                <section className="grow-[2] border w-[50%] flex flex-col justify-center items-center">
                    <p  className="text-gray-500">Word Bank</p>
                    <div className="flex flex-wrap gap-[10px] justify-center items-center">
                    {
                        words.map((word: string) => <p key={"W-"+word} className={`flex flex-wrap font-medium justify-center text-blue-500 text-2xl ${foundWords.includes(word) && 'line-through opacity-70'}`} >{word.toUpperCase()}</p>)
                    }
                    </div>
                </section>
            </main>
        </>
    )
}