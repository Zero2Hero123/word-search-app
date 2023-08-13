'use client'

import WordSearchGrid, { Direction, create2dArray } from "@/components/WordSearchGrid"
import { useRouter ,useSearchParams} from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

interface Node {
    x: number;
    y: number;
    letter: string;
}
function generate2dGrid(length: number, words: string[]): string[][] {
    let newGrid: string[][] = []
    for(let i=0;i<length;i++){
        let newArr = new Array(length)
        newArr.fill(null)
        newGrid.push(newArr)
    }

    let common: Node[] = []
    
    let x: number;
    let y: number;

    const directions: Direction[] = ["right" , "up" , "down" , "left" ]; // upL" , "upR" , "downL" , "downR"
    
    let currDirection: Direction = null;
    for(let word of words){
        x = Math.round(Math.random() * length-1)
        y = Math.round(Math.random() * length-1)

        

        let validDirection: Direction = directions.filter((d: Direction) => {
            
            switch(d){
                case 'right': // if  there is enough space for word to fit && every index for that word is empty
                    return newGrid[x][y+word.length] != undefined && newGrid[x].slice(y,y+word.length).every(c => c == null)
                    break;
                case 'up':
                    return newGrid[x-word.length][y] != undefined && newGrid.slice(x-word.length,x).map(row => row[y]).every(c => c != null)
                    break;
                case 'down':
                    return newGrid[x+word.length][y] != undefined && newGrid.slice(x,x+word.length).map(row => row[y]).every(c => c != null)
                    break;
                case 'left':
                    return newGrid[x][y-word.length] != undefined && newGrid.slice(x-word.length,x).every(c => c != null)
                    break;
            }

            return false;
        })[0]


        word.split('').forEach((c: string) => {
            newGrid[x][y] = c

            switch(validDirection){
                case 'right': // if  there is enough space for word to fit && every index for that word is empty
                    y++;
                    break;
                case 'up':
                    x--;
                    break;
                case 'down':
                    x++;
                    break;
                case 'left':
                    y--;
                    break;
            }
        })


    }

    return newGrid;
}

export const dynamic = 'force-dynamic'
export default function Game(){
    const params = useSearchParams();

    const [gridLength,setLength] = useState<number>(10);

    let [words,setWords] = useState<string[]>([]);

    const [foundWords,updateFoundWords] = useState<string[]>([]);

    const alphabet = [
        ['a','b','c','d','e','f','g','h','i','j'],
        ['k','l','m','n','o','p','q','r','r','t'],
        ['u','v','w','x','y','z']
    ]

    useEffect(() => {

        let paramWords = params.get('words')
        let paramLength = params.get('length')
        if(paramWords){
            setWords(paramWords.split(','))
            setLength(Number(paramLength))
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
                    <WordSearchGrid  updateFound={updateFoundWords} words={words} length={gridLength} letters={alphabet}/>
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