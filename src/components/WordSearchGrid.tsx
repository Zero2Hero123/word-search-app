'use client'

import { v4 as uuidv4 } from 'uuid'

import { createContext, useState, useEffect, useMemo, useLayoutEffect, Dispatch, SetStateAction } from "react";
import Letter from "./Letter";
import { useRouter } from 'next/router';


interface Props {
    letters: string[][];
    length: number;
    words: string[];
    addFound: (word: string) => void
}

export type Direction = 'up'| 'down' | 'right' | 'left' | null | 'upL' | 'upR' | 'downL' | 'downR'
export interface Position {
    x: number;
    y: number;
}
export interface Char {
    id: string | null;
    letter: string | null;
}

export const selectedContext = createContext(false);
export const allLetterIds = createContext(new Array());
export const dynamic = 'force-dynamic'

export function create2dArray<T>(length: number, letters: string[][]): T[][] {
    let newArr = new Array();
    
    for(let i = 0; i < length; i++){
        newArr.push([]);
    }

    letters.forEach((L: string[],i) => L.forEach((L2,j) => {

        // const k = uuidv4()

        let row = 0;
        while(newArr[row].length >= length) row++;
        
        newArr[row].push(L2+i+j)
    }))

    return newArr;
}

export default function WordSearchGrid({length, letters, words, addFound}: Props){

    const [isSelecting,setSelecting] = useState<boolean>(false);
    const [selectingDirection,setDirection] = useState<Direction>(null)
    
    const [foundLetterIds,updateFoundLetterIds] = useState<string[]>([])
    const [selectedSequence,updateSelectedSequence] = useState<string[]>([]);
    const [selectedLetterIds,updateLetterIds] = useState<string[]>([]);

    var allIds = create2dArray<string>(length,letters)

    useEffect(() => {
        console.log(selectedSequence)
    },[selectedSequence])
    useEffect(() => {
        console.log(selectingDirection)
    },[selectingDirection])

    let nextLetter: Char = useMemo(() => {
        
        if(selectingDirection != null){
            return getNextLetter();
        }

        return {letter: null, id: null}
    },[selectingDirection,selectedLetterIds])

    useEffect(() => {
        if(selectedSequence.length == 0) return;
        checkForWord(selectedSequence.join(""));

        if(!isSelecting){

            updateSelectedSequence([]);
            updateLetterIds([]);
            setDirection(null)
        }

       

    },[isSelecting,selectedSequence])

    useEffect(() => {
        if(isSelecting && selectedSequence.length >= 2 && selectingDirection == null){
            setDirection(getDirection());
        }
    },[selectedLetterIds,selectedSequence])

    // 
    function checkForWord(word: string){
        if(words.includes(word)){
            // user found a word!

            console.log("FOUND WORD, ",word)

            addFound(word)
            updateFoundLetterIds(prev => [...prev,...selectedLetterIds])
        }
    }

    function getDirection(): Direction {

        let direction: Direction = null

        const first = selectedLetterIds[0];
        const second = selectedLetterIds[1];

        let firstPos: Partial<Position> = {};
        let secondPos: Partial<Position> = {};

        const fx = allIds.findIndex((arr: string[]) => arr.includes(first));
        const sx = allIds.findIndex((arr: string[]) => arr.includes(second));

        const fy = allIds[fx].findIndex(v => v === first);
        const sy = allIds[sx].findIndex(v => v === second);

        firstPos.x = fx;
        firstPos.y = fy;
        secondPos.x = sx;
        secondPos.y = sy;

        console.log('--getDirection()--')
        console.log(first)
        console.log(firstPos)
        console.log(second)
        console.log(secondPos)
        console.log('---')


        if(secondPos.x > firstPos.x && secondPos.y > firstPos.y){
            direction = 'downR'
        } else if(secondPos.x < firstPos.x && secondPos.y < firstPos.y){
            direction = 'upL'
        } else if(secondPos.x > firstPos.x && secondPos.y < firstPos.y){
            direction = 'downL'
        } else if(secondPos.x < firstPos.x && secondPos.y > firstPos.y){
            direction = 'upR'
        } else if(secondPos.x > firstPos.x){
            direction = 'down'
        } else if(secondPos.x < firstPos.x){
            direction = 'up'
        } else if(secondPos.y > firstPos.y){
            direction = 'right'
        } else if(secondPos.y < firstPos.y){
            direction = 'left'
        }


        return direction;
    }

    function getNextLetter(): Char {
        const lastLetterId = selectedLetterIds[selectedLetterIds.length-1];

        const letterPos: Partial<Position> = {};
        let nextL: Char['letter'] = '';
        let nextId: Char['id'] = '';

        console.log('lastId: '+lastLetterId)
        console.log(allIds)

        letterPos.x = allIds.findIndex((arr: string[]) => arr.includes(lastLetterId));
        letterPos.y = allIds[letterPos.x].findIndex(v => v === lastLetterId);
        
        try{
            switch(selectingDirection){
                case 'up':
                    nextL = letters[letterPos.x-1][letterPos.y]
                    nextId = allIds[letterPos.x-1][letterPos.y]
                    break;
                case 'down':
                    nextL = letters[letterPos.x+1][letterPos.y]
                    nextId = allIds[letterPos.x+1][letterPos.y]
                    break;
                case 'right':
                    nextL = letters[letterPos.x][letterPos.y+1]
                    nextId = allIds[letterPos.x][letterPos.y+1]
                    break;
                case 'left':
                    nextL = letters[letterPos.x][letterPos.y-1]
                    nextId = allIds[letterPos.x][letterPos.y-1]
                    break;
                case null:
                    nextL = null
                    nextId = null
                    break;
                case 'upL':
                    nextL = letters[letterPos.x-1][letterPos.y-1]
                    nextId = allIds[letterPos.x-1][letterPos.y-1]
                    break;
                case 'upR':
                    nextL = letters[letterPos.x-1][letterPos.y+1]
                    nextId = allIds[letterPos.x-1][letterPos.y+1]
                    break;
                case 'downL':
                    nextL = letters[letterPos.x+1][letterPos.y-1]
                    nextId = allIds[letterPos.x+1][letterPos.y-1]
                    break;
                case 'downR':
                    nextL = letters[letterPos.x+1][letterPos.y+1]
                    nextId = allIds[letterPos.x+1][letterPos.y+1]
                    break;
            }
        } catch (err){
            nextL = null
            nextId = null
        }

        console.log(nextL)

        return {letter: nextL,id: nextId};
    }

    return (
        <>
            <selectedContext.Provider value={isSelecting}>
                
                <div onPointerUp={() => setSelecting(false)} className={`w-[700px] h-[700px] gap-2 grid grid-rows-[repeat(10,1fr)] grid-cols-[repeat(10,1fr)]`}>
                    {
                        letters.map((L: string[],i) => L.map((L2,j) => {

                            
                            return <Letter foundIds={foundLetterIds} nextLetter={nextLetter} selectingDirection={selectingDirection}  allIds={allIds} updateLetterIds={updateLetterIds} letterIds={selectedLetterIds} updateSequence={updateSelectedSequence} setSelecting={setSelecting} k={L2+i+j} key={L2+i+j} letter={L2}/>
                        }))
                    }
                
                </div>
                
            </selectedContext.Provider>
        </>
    )
}