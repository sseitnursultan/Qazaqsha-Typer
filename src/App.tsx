import react, {useEffect, useRef, useState} from 'react'
import {Card} from '../src/components/Card'
import './App.css'
import {Words, Titles} from "./Words";

import React from 'react';

function App() {

    const [typingText, setTypingText]= useState<any[]>([])
    const [characters,setCharacters] = useState('')


    const typingTextRef = useRef(null)

    useEffect(()=>{
        randomParagraph()
    },[])

    function randomParagraph() {
        const randomIndex = Math.floor(Math.random() * Words.length)
        const characters = Words[randomIndex].split("")
        const spanElements = characters.map((char,index)=>(
            <span key={index}>{char}</span>
        ))
        setTypingText(spanElements)
    }

    return (
        <div className={'app'}>
            <Card typingText={typingText}
                  randomParagraph={randomParagraph}
            />
        </div>
    );
}

export default App;