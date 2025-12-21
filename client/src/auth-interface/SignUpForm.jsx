import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css"
import { AuthContext } from "./AuthContext";

export default function SignUpForm({ redirectTo }) {
    const [showPassword, setShowPassword] = useState(false)

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [validUser, setValidUser] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [validConfirmPassword, setValidConfirmPassword] = useState(false)

    const handleUsername = (e) => {
        const value = e.target.value
        setUsername(value)
        setValidUser(/^[A-Za-z0-9_]+$/.test(value) && value !== "")
    }

    const handleEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidEmail(e.target.checkValidity()); // HTML5 email check
    };

    const handlePassword = (e) => {
        const value = e.target.value
        setPassword(value)
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,14}$/
        setValidPassword(regex.test(value))

        // cập nhật confirm luôn nếu người dùng gõ trước
        setValidConfirmPassword(value === confirmPassword)
    };

    const handleConfirmPassword = (e) => {
        const value = e.target.value
        setConfirmPassword(value)
        setValidConfirmPassword(value === password);
    };

    const navigate = useNavigate()
    const { signup } = useContext(AuthContext)
    const [error, setError] = useState("") 

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (password !== confirmPassword) return alert("Mật khẩu không khớp")

        const result = await signup({ 
            username: username, // thêm: lấy từ ô Tên đăng nhập
            email: email,       // thêm: lấy từ ô Email
            password: password,
            fullname: username  // thêm: tạm thời dùng username làm fullname
        })

        if (result.success) {
            alert("Đăng ký thành công!")
            window.location.reload()
        } else {
            setError(result.message)
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Tên đăng nhập</label><br/>
                <input  
                    className={`${styles.input} ${validUser ? styles.validInput : ""}`} 
                    type="text" 
                    id="username" 
                    placeholder="nguyenvana" 
                    required pattern="[A-Za-z0-9_]+"    
                    onChange={handleUsername}
                    title="Tên đăng nhập vui lòng không chứa khoảng trắng hoặc ký tự đặc biệt"
                /><br/>

                <label htmlFor="email">Email</label>
                <input  
                    className={`${styles.input} ${validEmail ? styles.validInput : ""}`}
                    type="email" 
                    id="email" 
                    placeholder="nguyenvana@gmail.com" 
                    required
                    onChange={handleEmail}
                /><br/>

                <div className={styles.passwordWrapper}>
                    <label htmlFor="signupPassword">Mật khẩu:</label><br/>
                    <input   
                        className={`${styles.input} ${validPassword ? styles.validInput : ""}`}
                        type={showPassword ? "text" : "password"} 
                        id="signupPassword"
                        placeholder="Mật khẩu" 
                        required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,14}$" 
                        onChange={handlePassword}
                        title="Mật khẩu vui lòng có chữ hoa, chữ thường, số, ký tự đặc biệt và dài 6->14 ký tự"
                    /><i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} ${styles.togglePassword}`} onClick={() => setShowPassword(!showPassword)}></i>
                </div>

                <div className={styles.passwordWrapper}>
                    <label htmlFor="confirmPassword">Nhập lại mật khẩu:</label><br/>
                    <input 
                        className={`${styles.input} ${validConfirmPassword ? styles.validInput : ""}`}
                        type={showPassword ? "text" : "password"} 
                        id="confirmPassword" 
                        placeholder="Nhập lại mật khẩu"
                        required
                        onChange={handleConfirmPassword}
                    /><i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} ${styles.togglePassword}`} onClick={() => setShowPassword(!showPassword)} onChange={() => confirmPassword()}></i>
                </div>

                <div className={styles.smallContainer}>
                    <input type="checkbox" id="checkbox" value="yes" required/><label htmlFor="checkbox">Tôi đồng ý với điều khoản sử dụng</label>    
                </div>        
                
                <button type="submit" className={styles.gradientButton}>
                    Đăng Ký
                </button>          
            </form>
        </div>
    )
}