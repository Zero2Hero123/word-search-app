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
import { uuid } from "uuidv4";


export const dynamic = 'force-dynamic'
export default function Game(){
    const params = useSearchParams();

    const [gridLength,setLength] = useState<number>(10);
    const [grid,setGrid] = useState<string[][]>(createEmptyGrid())

    let [words,setWords] = useState<string[]>(params.get('words')!.split(','));
    const gridGenerator = useMemo(() => createGenerator(words,gridLength),[words])

    const [foundWords,updateFoundWords] = useState<Set<string>>( new Set());
    const [timer,updateTimer] = useState<number>(0);
    const [isSolved,setSolved] = useState<boolean>(false)

    const parsedTime = useMemo(() => {

        return `${Math.floor(timer / 60)}:${(timer % 60) > 9 ? (timer % 60) : '0'+(timer % 60)}`

    },[timer])

    function addFound(word: string){
        updateFoundWords(prev => {
            prev.add(word)

            return new Set(prev);
        })
    }

    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            if(!isSolved) updateTimer(prev => prev+1);
        },1000)

        return () => {
            clearInterval(timer)
        }
    },[])

    useEffect(() => {
        console.log('found',foundWords.size)
        console.log('total',words.length)
        if(foundWords.size == words.length){
            // COMPLETED
            setSolved(true)
            console.log("SOLVED")
        }
    },[foundWords])

    useEffect(() => {
        if(grid[0][0] != '') return;
        gridGenerator.generateGrid()
            .then((res) => {

                console.log(res)
                setGrid(res.grid)
                setWords(res.words)

            })
            .catch(err => {
                console.error(err)
            })
    },[words])

    const alphabet = [
        ['a','b','c','d','e','f','g','h','i','j'],
        ['k','l','m','n','o','p','q','r','r','t'],
        ['u','v','w','x','y','z']
    ]


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
                        <WordSearchGrid  addFound={addFound} words={words} length={gridLength} letters={grid}/>
                    </section>
                </main>
            </div>

            {/* Word bank */}
            <div className="border grow flex flex-col justify-center items-center gap-2">
                <section className=" w-[250px] h-[500px] border flex flex-col justify-around items-center">

                    <p  className="text-blue-500 text-4xl font-medium">Word Bank</p>
                    <Link className="bg-red-500 hover:bg-red-400 text-white p-1 rounded-md" href='/'><ArrowLeftToLine/></Link>
                    {words.length > 0 ? 
                        <div className=" justify-center items-center">
                        {
                            words.map((word: string) => <p key={uuid()} className={`block font-medium justify-center text-black text-xl ${foundWords.has(word) && 'line-through opacity-70'}`} >{word.toUpperCase()}</p>)
                        }
                        </div>    
                        :
                        <div className="w-[70%] grow"></div>
                    }
                </section>
                <span className="text-3xl font-bold text-blue-500">{parsedTime}</span>
            </div>
        </div>
        <Drawer open={isSolved}>
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