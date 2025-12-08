import { useState } from "react"
import styles from "./Auth.module.css"

export default function ForgotPasswordModal({onClose, onSuccess}) {
    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false)

    const handleEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidEmail(e.target.checkValidity()); // HTML5 email check
    };

    //note gen password at server?
    const genPassword = () => {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const numbers = "0123456789"
        const length = Math.floor(Math.random() * 9) + 6 // 6-14 characters
        let password = ""   

        // Ensure at least one uppercase and one number
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
        password += numbers.charAt(Math.floor(Math.random() * numbers.length))

        // Fill the rest with random uppercase and numbers
        const chars = uppercase + numbers
        for (let i = password.length; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        // Shuffle the password
        return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
    } 

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        // Giả lập calling api
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert("Mật khẩu đã được đặt lại, hãy kiểm tra email của bạn")
        
        onSuccess()
    }

    return(
        <div className={styles.authContainer} id={styles.forgotModal}>
            <div id={styles.modalHeaderWrapper}>
                <h1>Đặt lại mật khẩu</h1>
                <button onClick={onClose}>X</button>      
            </div>

            <p id={styles.modal_p}>Hãy điền email bạn đã dùng để dăng ký, chúng tôi sẽ gửi mật khẩu mới tới email của bạn.</p>
            <label htmlFor="email">Email</label>

            <form onSubmit={handleSubmit}>
                <input  
                    className={`${styles.input} ${validEmail ? styles.validInput : ""}`}
                    type="email" 
                    id="email" 
                    placeholder="nguyenvana@gmail.com" 
                    required
                    onChange={handleEmail}
                /><br/>

                <button type="submit" className={styles.gradientButton}>
                    Xác nhận
                </button>

            </form>
        </div>
    )
}