import styles from './Button.module.css';
import { useState } from 'react';

function Button() {
    const inlineStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    };  

    const [count, setCount] = useState(0);

    const handleClick =  (name) => {
        setCount(c => c + 1)
        console.log(`${name} Ouch ${count}`)
        // e.target.textContent = `Ouch ${count}`
    }

    const [car, setCar] = useState({year: 2022, name: "honda", color: "black"});

    const handleCarClick = () => {
        setCar(prevCar => ({...prevCar, year: e.target.value}))
    }

    return (
        <button className={styles.button} onClick={() => handleClick("Pien")} style={inlineStyle}>{(count < 1) ? "Click me !" : `Ouch ${count}`}</button>
    );
}

export default Button;