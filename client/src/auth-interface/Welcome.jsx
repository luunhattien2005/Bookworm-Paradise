import styles from "./Auth.module.css"
import { useNavigate } from "react-router-dom"

export default function Welcome() {
    const navigate = useNavigate()
    return (
        <>
            <div className={styles.background}>
                <div className={styles.welContainer}>
                    <div style={{fontFamily: "Bebas Neue, sans-serif", fontSize: "128px", letterSpacing: "25px"}}>
                        Bookworm <br /> Paradise
                    </div>
                    <hr/>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <p style={{fontSize: "40px"}}>Nơi đam mê bắt đầu</p><br/>
                            <button className={styles.gradientButton} 
                                    style={{fontSize: "40px", fontStyle: "italic", width: "fit-content"}}
                                    onClick={() => { navigate("/home") }}>
                                Khám phá ngay
                            </button>
                        </div>
                        <div>
                            <img src="/img/bookworm-removebg.png"
                                style={{height: "150px"}}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}