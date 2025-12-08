import { useState } from "react"
import { useLocation } from "react-router-dom"
import styles from './Auth.module.css'
import LoginForm from "./LoginForm"
import SignUpForm from "./SignUpForm"

export default function Auth() {
    const [activeTab, setActiveTab] = useState("login")
    const location = useLocation()
    const redirectTo = location.state?.form?.pathname || "/home"

    return(
        <div className={styles.background}>
            <div className={styles.authContainer}>
                <div className={styles.tabContainer}>
                    <button className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`} onClick={() => setActiveTab("login")}>Login</button>
                    <button className={`${styles.tab} ${activeTab === "signup" ? styles.tabActive : ""}`} onClick={() => setActiveTab("signup")}>Sign Up</button>
                </div>

                {activeTab === "login" && <LoginForm redirectTo={ redirectTo }/>}
                {activeTab === "signup" && <SignUpForm redirectTo={ redirectTo }/>}
                

            </div>
        </div>
    )
}
