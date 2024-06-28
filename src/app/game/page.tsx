'use client'

import WordSearchGrid, { Direction, create2dArray } from "@/components/WordSearchGrid"
import { useRouter ,useSearchParams} from "next/navigation";
import { use, useEffect, useLayoutEffect, useMemo, useState } from "react";
import generate from "./generate";
import createGenerator from "./generate";
import { ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function Game(){
    const params = useSearchParams();

    const [gridLength,setLength] = useState<number>(10);
    const [grid,setGrid] = useState<string[][]>(createEmptyGrid())

    let [words,setWords] = useState<string[]>([]);
    let [reducedWords,setReduced] = useState<string[]>([])
    const gridGenerator = useMemo(() => createGenerator(words,gridLength),[words])

    const [foundWords,updateFoundWords] = useState<string[]>([]);
    const [timer,updateTimer] = useState<number>(0);
    const [isSolved,setSolved] = useState<boolean>(false)

    const parsedTime = useMemo(() => {

        return `${Math.floor(timer / 60)}:${(timer % 60) > 9 ? (timer % 60) : '0'+(timer % 60)}`

    },[timer])

    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            if(!isSolved) updateTimer(prev => prev+1);

            console.log(sessionStorage.getItem('unused'))
        },1000)

        return () => {
            clearInterval(timer)
        }
    },[])

    useEffect(() => {
        console.log('done? ',foundWords.length == words.length)
        if(foundWords.length == words.length){
            // COMPLETED
            setSolved(false)
            console.log("SOLVED")
        }
    },[foundWords])

    useEffect(() => {
        gridGenerator.generateGrid()
            .then((res) => {

                console.log(res)
                setGrid(res)

                setReduced(words.filter(w => sessionStorage.getItem('unused')!.split(',').indexOf(w) == -1))
            })
            .catch(err => {
                console.error(err)
            })
    },[words])

    useEffect(() => {
        console.log(words)
        console.log(grid)
    },[words])

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
        <div className="flex flex-row-reverse">

            {/* Word Search Grid */}
            <div className="grow-[3]">
                <header >
                    <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
                </header>
                <main className=' flex flex-col justify-center items-center'>
                    <section className="grow flex justify-center items-center">
                        <WordSearchGrid  updateFound={updateFoundWords} words={reducedWords} length={gridLength} letters={grid}/>
                    </section>
                </main>
            </div>

            {/* Word bank */}
            <div className="border grow flex flex-col justify-center items-center gap-2">
                <section className=" w-[250px] h-[500px] border flex flex-col justify-around items-center">

                    <p  className="text-blue-500 text-4xl font-medium">Word Bank</p>
                    <Link className="bg-red-500 hover:bg-red-400 text-white p-1 rounded-md" href='/'><ArrowLeftToLine/></Link>
                    {reducedWords.length > 0 ? 
                        <div className=" justify-center items-center">
                        {
                            reducedWords.map((word: string) => <p key={"W-"+word} className={`block font-medium justify-center text-black text-xl ${foundWords.includes(word) && 'line-through opacity-70'}`} >{word.toUpperCase()}</p>)
                        }
                        </div>    
                        :
                        <div className="w-[70%] grow"></div>
                    }
                </section>
                <span className="text-3xl font-bold text-blue-500">{parsedTime}</span>
            </div>
        </div>
        <Drawer open>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        <span className="text-4xl text-white flex justify-center">You Did It!</span>
                    </DrawerTitle>
                    <DrawerDescription className="flex justify-center text-2xl">
                        You solved the Word Search in {parsedTime}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <div className="flex justify-center">
                        <Link href='/'>
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        </>
    )
}

function createEmptyGrid(): string[][] {
    const newGrid = new Array<string[]>(10); 
    for(let i=0;i<newGrid.length;i++) {
        newGrid[i] = new Array(10).fill('')
    }

    return newGrid;
}