import styles from "./Profile.module.css";
import { useState , useRef} from 'react';
import { useMe } from "../hooks/useAuth";

export default function ChangePassword() {
    const [oldPassword,    setOldPassword]    = useState("");
    const [newPassword,    setNewPassword]    = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [dialogMessage, setDialogMessage] = useState("");
    const [isDialogON, SetisDialogON] = useState(false)
    const dialogRef = useRef(null);
    
    const handleSave = () => {
        // userPassword = useMe(localStorage.getItem("token"), 'password')

        if (!oldPassword || !newPassword || !repeatPassword) {
            showDialog("All fields must be filled");
            return;
        }

        if (oldPassword === newPassword) {
            showDialog("New Password cannot be the same as Old Password");
            return;
        }

        if (newPassword !== repeatPassword) {
            showDialog("Repeat password is not the same as New Password");
            return;
        }

        if (oldPassword !== "asdasdsad") {
            showDialog("Wrong Password");
            return;
        }

        // Change and send back to database
        user.password = newPassword


        showDialog("Password changed successfully ✅");
    };

    const showDialog = (message) => {
        setDialogMessage(message);
        SetisDialogON(true);
        dialogRef.current.showModal(); 

        // Set all filed back to its blank state
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("")
    };


    return (
        <>
        <div className={styles.rightContainer}>
            <p>Thay đổi mật khẩu</p>

            <div className={styles.password}>
                <div className={styles.passwordFirstDiv}>
                    <label htmlFor="Old_Password"        >Mật khẩu hiện tại    </label>
                    <label htmlFor="New_Password"        >Mật khẩu mới         </label>
                    <label htmlFor="New_Password_Repeat" >Nhập lại mật khẩu mới</label>
                </div>

                <div className={styles.passwordSecondDiv}>
                    <input type="password" id="Old_Password"        value={oldPassword}    onChange={(e) => setOldPassword   (e.target.value)}/>
                    <input type="password" id="New_Password"        value={newPassword}    onChange={(e) => setNewPassword   (e.target.value)}/>
                    <input type="password" id="New_Password_Repeat" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>
                </div>
            </div>

            <div className={styles.passwordButton}>
                <button onClick={handleSave}>Lưu thay đổi</button>
            </div>
		</div>

        {/* DIALOG SECTION */}
        <dialog ref={dialogRef} className={styles.dialog} style={isDialogON ? { display: "grid" } : { display: "none" }}>
                <p>{dialogMessage}</p>
                <button onClick={() => {dialogRef.current.close(); SetisDialogON(false)}}> Close </button>
        </dialog>
        </>
    )
}