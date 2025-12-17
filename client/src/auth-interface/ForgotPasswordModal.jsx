import { useState, useRef, useEffect } from "react"
import styles from "./Auth.module.css"

export default function ForgotPasswordModal({open, onClose, onSuccess}) {
    const dialogRef = useRef(null)
    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false)

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [open])
    
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

    return (
        <dialog
            ref={dialogRef}
            className={styles.forgotDialog}
            onCancel={onClose}   // ESC
            onClose={onClose}
        >
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h1>Đặt lại mật khẩu</h1>
                    <button onClick={onClose}>✕</button>
                </div>

                <p className={styles.modalText}>
                    Hãy điền email bạn đã dùng để đăng ký, chúng tôi sẽ gửi mật khẩu mới.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        className={`${styles.input} ${validEmail ? styles.validInput : ""}`}
                        type="email"
                        placeholder="nguyenvana@gmail.com"
                        required
                        onChange={handleEmail}
                    />

                    <button type="submit" className={styles.gradientButton}>
                        Xác nhận
                    </button>
                </form>
            </div>
        </dialog>
    )
}