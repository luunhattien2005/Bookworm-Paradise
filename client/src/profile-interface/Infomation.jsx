import styles from "./Profile.module.css";
import { AuthContext } from '../auth-interface/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useUpdateUser } from "../hooks/useAuth";

export default function Information() {
    const { user, refreshUser } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false);

    const updateMutation = useUpdateUser({
        onSuccess: async () => {
            if (refreshUser) await refreshUser();
            alert("Cập nhật hồ sơ thành công!");
            setIsEditing(false);
        },
        onError: (err) => {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    });

    const [draft, setDraft] = useState({
        fullname: "", phone: "", email: "", sex: "Others", birthday: "", address: ""
    })

    useEffect(() => {
        if (user) {
            setDraft({
                fullname: user.fullname || "",
                phone: user.phone || "",
                email: user.email || "", 
                sex: user.sex || "Others",
                birthday: user.birthday ? user.birthday.split('T')[0] : "", 
                address: user.address || ""
            })
        }
    }, [user])

    const cancelEditing = () => {
        if (user) {
            setDraft({
                fullname: user.fullname || "",
                phone: user.phone || "",
                email: user.email || "", 
                sex: user.sex || "Others",
                birthday: user.birthday ? user.birthday.split('T')[0] : "", 
                address: user.address || ""
            })
        }
        setIsEditing(false);
    };

    const saveEditing = () => {

        const phone = draft.phone.trim();
        const address = draft.address.trim();
        if (!phone || !address) {
            alert("Số điện thoại và địa chỉ không được để trống.");
            return;
        }

        const formData = new FormData();
        formData.append("fullname", draft.fullname);
        formData.append("phone", draft.phone);
        formData.append("address", draft.address);
        formData.append("sex", draft.sex);
        formData.append("birthday", draft.birthday);
        updateMutation.mutate(formData);
    };

    // Nếu user chưa có dữ liệu, hiện loading nhẹ thay vì trắng trang
    if (!user) return null; 

    return (
        <div className={styles.rightContainer}>
            <p>Hồ sơ cá nhân</p>

            <div className={styles.information}>
                <div className={styles.informationFirstDiv}>
                    <label>Họ tên</label>
                    <label>Số điện thoại</label>
                    <label>Email</label>
                    <label>Giới tính</label>
                    <label>Ngày sinh</label>
                    <label>Địa chỉ nhận hàng</label>
                </div>

                <div className={styles.informationSecondDiv}>
                    <input type="text" value={draft.fullname} onChange={(e) => setDraft({ ...draft, fullname: e.target.value })} readOnly={!isEditing} />
                    <input type="text" maxLength={11} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.email} disabled /> 

                    <select value={draft.sex} onChange={(e) => setDraft({ ...draft, sex: e.target.value })} disabled={!isEditing}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Others">Others</option>
                    </select>

                    <input type="date" value={draft.birthday} onChange={(e) => setDraft({ ...draft, birthday: e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} readOnly={!isEditing} />
                </div>
            </div>

            <div className={styles.informationButton}>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)}> Thay đổi Thông Tin </button>
                )}

                {isEditing && (
                    <>
                        <button style={{ color: "lightcoral" }} onClick={cancelEditing}> Hủy bỏ </button>
                        <button onClick={saveEditing} disabled={updateMutation.isLoading}>
                            {updateMutation.isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}