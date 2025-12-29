import styles from "./Profile.module.css";
import { useState, useRef } from 'react';
import { useUpdateUser } from "../hooks/useAuth";
import { useCheckPassword } from "../hooks/useAuth";
import { useDialog } from "../header-footer-interface/DialogContext";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const passwordRef = useRef(null);
    const checkPassMutation = useCheckPassword()

    // Dialog set up
    const { showDialog } = useDialog();

    // Setup Hook cập nhật
    const updateMutation = useUpdateUser({
        onSuccess: () => {
            showDialog("Đổi mật khẩu thành công! ✅");
            // Reset form
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
        },
        onError: (err) => {
            showDialog("Lỗi: " + (err.response?.data?.message || err.message));
        }
    });

    const  handleSave = async () => {
        if (!newPassword || !repeatPassword || !oldPassword) {
            showDialog("Vui lòng nhập đầy đủ các trường");
            return;
        }

        let isValid = passwordRef.current?.checkValidity() ?? false;
        if (!isValid) {
            showDialog("Mật khẩu mới: 4 - 16 ký tự; có chữ hoa, thường, số, ký tự đặc biệt");
            return;
        }

        if (newPassword !== repeatPassword) {
            showDialog("Mật khẩu nhập lại không khớp");
            return;
        }

        let result = await checkPassMutation.mutateAsync(oldPassword);
        if (!result.isCorrect) { 
            showDialog("Mật khẩu cũ không khớp");
            return;
        }

        if (newPassword === oldPassword) {
            showDialog("Mật khẩu mới không được trùng mật khẩu cũ");
            return;
        }


        // Chuẩn bị FormData
        const formData = new FormData();
        formData.append("password", newPassword);

        // Gửi request
        updateMutation.mutate(formData);
    };

    return (
        <>
            <div className={styles.rightContainer}>
                <p>Thay đổi mật khẩu</p>

                <div className={styles.password}>
                    <div className={styles.passwordFirstDiv}>
                        <label htmlFor="Old_Password">Mật khẩu hiện tại</label>
                        <label htmlFor="New_Password">Mật khẩu mới</label>
                        <label htmlFor="New_Password_Repeat">Nhập lại mật khẩu mới</label>
                    </div>

                    <div className={styles.passwordSecondDiv}>
                        <input type="password" id="Old_Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <input type="password" id="New_Password" value={newPassword} ref={passwordRef} required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,14}$" onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" id="New_Password_Repeat" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    </div>
                </div>

                <div className={styles.passwordButton}>
                    <button onClick={handleSave} disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </>
    )
}