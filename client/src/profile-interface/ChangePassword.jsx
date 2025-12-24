import styles from "./Profile.module.css";
import { useState, useRef } from 'react';
import { useUpdateUser } from "../hooks/useAuth";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [dialogMessage, setDialogMessage] = useState("");
    const [isDialogON, SetisDialogON] = useState(false)
    const dialogRef = useRef(null);

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

    const handleSave = () => {
        if (!newPassword || !repeatPassword) {
            showDialog("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (newPassword !== repeatPassword) {
            showDialog("Mật khẩu nhập lại không khớp");
            return;
        }

        // Tạm thời bỏ qua check Old Password vì Backend chưa hỗ trợ
        // if (oldPassword !== "...") { ... }

        // Chuẩn bị FormData
        const formData = new FormData();
        formData.append("password", newPassword);

        // Gửi request
        updateMutation.mutate(formData);
    };

    const showDialog = (message) => {
        setDialogMessage(message);
        SetisDialogON(true);
        if (dialogRef.current) dialogRef.current.showModal();
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
                        {/* Backend chưa check pass cũ, nhưng cứ để input đây cho UI đẹp */}
                        <input type="password" id="Old_Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

                        <input type="password" id="New_Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" id="New_Password_Repeat" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    </div>
                </div>

                <div className={styles.passwordButton}>
                    <button onClick={handleSave} disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>

            {/* DIALOG SECTION */}
            <dialog ref={dialogRef} className={styles.dialog} style={isDialogON ? { display: "grid" } : { display: "none" }}>
                <p>{dialogMessage}</p>
                <button onClick={() => { dialogRef.current.close(); SetisDialogON(false) }}> Close </button>
            </dialog>
        </>
    )
}