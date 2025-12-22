import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css"
import ForgotPasswordModal from "./ForgotPasswordModal";
import { AuthContext } from "./AuthContext";

export default function LoginForm({ redirectTo }) {
    const [identity, setIdentity] = useState("") //identity could be username or email
    const [password, setPassword] = useState("")
    // const [error, setError] = useState("") // thêm: để hiện thông báo lỗi
    const [showPassword, setShowPassword] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const handleSubmit = async(e) => { 
        e.preventDefault()
        const res = await login(identity, password) 

        if (res.success) { //  chỉ chuyển trang khi thành công
            navigate(redirectTo, {replace: true})
        } else {
            alert(res.message) // hiển thị lỗi từ backend (ví dụ: "Tài khoản bị khóa")
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}> 
                <label htmlFor="loginUsername">Tên đăng nhập hoặc email:</label><br/>
                <input 
                    className={styles.input} 
                    type="text" 
                    id="loginUsername" 
                    required 
                    onChange={(e) => setIdentity(e.target.value)}
                /><br/>
                
                <div className={styles.passwordWrapper}>
                    <label htmlFor="loginPassword">Mật khẩu:</label><br/>
                    <input 
                        className={styles.input} 
                        type={showPassword ? "text" : "password"} 
                        id="loginPassword" 
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    /><i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} ${styles.togglePassword}`} onClick={() => setShowPassword(!showPassword)}></i>
                </div>

                <div className={styles.smallContainer}>
                    <p onClick={() => setShowForgotPassword(true)}>Quên mật khẩu?</p>
                </div>

                <button type="submit" className={styles.gradientButton}>
                    Đăng nhập
                </button>  
            </form>

            {showForgotPassword && (
                <ForgotPasswordModal
                    open={showForgotPassword}
                    onClose={() => setShowForgotPassword(false)}
                    onSuccess={() => setShowForgotPassword(false)}
                />
            )}
        </>
    )
}

