'use client'

import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { Char, Direction, selectedContext } from "./WordSearchGrid";

interface Props {
    letter: string;
    k: string;
    letterIds: string[];
    updateLetterIds: Dispatch<SetStateAction<string[]>>;
    setSelecting: Dispatch<SetStateAction<boolean>>;
    updateSequence: Dispatch<SetStateAction<string[]>>;

    allIds: string[][];
    nextLetter: Char
    selectingDirection: Direction
}


export default function Letter({letter,setSelecting, updateSequence,updateLetterIds,letterIds, k,nextLetter,selectingDirection}: Props){

    const isSelecting = useContext(selectedContext);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(isSelecting && letterIds.includes(k)){
            
            if(container.current){
                container.current.classList.replace('bg-white','bg-blue-500')
                container.current.classList.add('text-white')
            }

        } else {
            if(container.current){
                container.current.classList.replace('bg-blue-500','bg-white')
                container.current.classList.remove('text-white')
            }
        }
        
    },[letterIds])

    function update(newVal: boolean){
        setSelecting(newVal);

        if(newVal){
            updateSequence(prev => [...prev,letter])
            updateLetterIds(prev => [...prev,k])
        }
    }

    function check(){

        if(isSelecting && nextLetter.letter == letter && nextLetter.id == k){
            updateSequence(prev => [...prev,letter])
            updateLetterIds(prev => [...prev,k])
        }

        if(isSelecting && selectingDirection == null && !letterIds.includes(k)){
            updateSequence(prev => [...prev,letter])
            updateLetterIds(prev => [...prev,k])
            
        }

        console.log('check')
    }
    

    return (
        <div ref={container} onPointerOver={check} onPointerDown={() => update(true)} onPointerUp={() => update(false)}  className={` border rounded-md bg-white flex justify-center items-center text-4xl font-bold select-none hover:cursor-pointer active:bg-blue-600 active:text-white transition-all`}>{letter.toUpperCase()}</div>
    )
}