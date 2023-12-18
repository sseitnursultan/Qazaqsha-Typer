import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import internal from "stream";

type propsType = {
    typingText: any
    randomParagraph: any
}

export function Card(props: propsType) {
    const inputRef = useRef<HTMLInputElement>(null)
    const typingTextRef = useRef<HTMLParagraphElement>(null);
    const cpmTag = useRef<any>()
    const intervalRef = useRef<any>();
    const tryAgainRef = useRef<HTMLButtonElement>()
    const [typedChars, setTypedChars] = useState('')
    let [charIndex, setCharIndex] = useState(0)
    const [errorIndices, setErrorIndices] = useState<number[]>([]);
    let [mistakes, setMistakes] = useState(0)
    let [time, setTime] = useState(0)
    let [timeLeft, setTimeLeft] = useState(60)
    let [isTypingStarted, setIsTypingStarted] = useState(false);
    const [wpm, setWpm] = useState(0)
    const [cpm, setCpm] = useState(0)
    let maxTime = 60



    function resetGame() {
        props.randomParagraph();
        setTimeLeft(maxTime);
        setTypedChars('');
        setCharIndex(0);
        setErrorIndices([]);
        setMistakes(-1);
        setIsTypingStarted(false);
        setWpm(0);
        setCpm(0);





        const paragraph = typingTextRef.current;
        if (paragraph) {
            const spans = paragraph.querySelectorAll('span');
            spans.forEach((span: HTMLElement) => {
                span.classList.remove('active', 'correct', 'incorrect');
            });
        }
    }

    useEffect(() => {
        const handleKeyDown = () => {
            inputRef.current?.focus()
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleKeyDown);
        };
    })


    useEffect(() => {
        initTyping()
    }, [charIndex, typedChars, errorIndices])

    useEffect(() => {


        if (isTypingStarted && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prevState => {
                    if (prevState > 0) {
                        return prevState - 1;
                    } else {
                        clearInterval(intervalRef.current);
                        return prevState;
                    }
                });
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isTypingStarted, timeLeft]);




    function initTyping() {
        const paragraph = typingTextRef.current;
        if (paragraph && typedChars.length > 0 && !isTypingStarted) {
            setIsTypingStarted(true);
        }
        if (paragraph) {
            const spans = paragraph.querySelectorAll('span');
            spans.forEach((span: HTMLElement, index: number) => {
                if (index === charIndex) {

                    const typedChar = typedChars.charAt(index);
                    const isCorrect = typedChar === span.textContent;
                    span.classList.remove('active')

                    span.classList.toggle('correct', isCorrect);
                    span.classList.toggle('incorrect', !isCorrect);
                    span.classList.add('active');

                    if (!isCorrect && !errorIndices.includes(charIndex)) {
                        setErrorIndices(prevErrors => [...prevErrors, charIndex]);
                        setMistakes(prevMistakes => prevMistakes + 1);
                    } else if (isCorrect && errorIndices.includes(charIndex)) {
                        setErrorIndices(prevErrors => prevErrors.filter(errorIndex => errorIndex !== charIndex));
                        setMistakes(prevMistakes => Math.max(0, prevMistakes - 1));
                    }
                } else {
                    span.classList.remove('active');
                    if (!errorIndices.includes(index)) {
                        span.classList.remove('incorrect');
                    }
                }
            });
        }
        const divisor = 60 - timeLeft > 0 ? 60 - timeLeft : 1;
        setWpm(Math.round(((typedChars.length - mistakes)  / 5) / divisor * 60))
        setCpm(typedChars.length-mistakes)
    }



    function handleInputValue(e: ChangeEvent<HTMLInputElement>) {

        if (timeLeft === 0) {
            return;
        }



        const inputvalue = e.target.value;
        const isDeleting = inputvalue.length < typedChars.length;
        setTypedChars(inputvalue);
        setCharIndex(inputvalue.length - 1);


        if (isDeleting) {
            if (errorIndices.includes(inputvalue.length)) {
                setErrorIndices(prevErrors => prevErrors.filter(errorIndex => errorIndex !== inputvalue.length));
                setMistakes(prevMistakes => Math.max(0, prevMistakes - 1));
            }
            const typedChar = typedChars.charAt(inputvalue.length);
            const correspondingSpan = typingTextRef.current?.querySelectorAll('span')[inputvalue.length];
            if (correspondingSpan && typedChar === correspondingSpan.textContent) {
                correspondingSpan.classList.remove('correct');
            }
        }
    }

    return (
        <div className={'wrapper'}>
            <input type="text" className={'input-field'} ref={inputRef} onChange={handleInputValue} value={typedChars}/>
            <div className={'content-box'}>
                <div className={'typing-text'}>
                    <p ref={typingTextRef}>{props.typingText}</p>
                </div>
                <div className={'content'}>
                    <ul className={'result-details'}>
                        <li className={'time'}>
                            <p>Уакыт</p>
                            <span><b>{timeLeft}</b>s</span>
                        </li>

                        <li className={'mistake'}>
                            <p>Кате</p>
                            <span>{mistakes}</span>
                        </li>

                        <li className={'wpm'}>
                            <p>Wpm</p>
                            <span>{wpm < 0 ? '0' : wpm}</span>
                        </li>

                        <li className={'cpm'}>
                            <p>Дурыс</p>
                            <span>{cpm < 0 ? '0' : cpm}</span>
                        </li>
                    </ul>
                    <button onClick={resetGame}>Try Again</button>
                </div>
            </div>
        </div>
    );
}

