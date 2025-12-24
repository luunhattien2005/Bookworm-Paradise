import styles from "./Profile.module.css";
import { AuthContext } from '../auth-interface/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useUpdateUser } from "../hooks/useAuth";

export default function Information() {
    const { user } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false);

    // Setup Hook cập nhật
    const updateMutation = useUpdateUser({
        onSuccess: () => {
            alert("Cập nhật hồ sơ thành công!");
            setIsEditing(false);
        },
        onError: (err) => {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    });

    // State nháp
    const [draft, setDraft] = useState({
        fullname: "",
        phone: "",
        email: "",
        sex: "Others",
        birthday: "",
        address: ""
    });

    // Đồng bộ dữ liệu từ User vào Draft khi load trang
    useEffect(() => {
        if (user) {
            setDraft({
                fullname: user.fullname || "",
                phone: user.phone || "",
                email: user.email || "", // Email thường không cho sửa, nhưng cứ để hiển thị
                sex: user.sex || "Others",
                birthday: user.birthday ? user.birthday.split('T')[0] : "", // Format lại ngày nếu cần
                address: user.address || ""
            })
        }
    }, [user]);

    const cancelEditing = () => {
        // Reset về dữ liệu gốc
        setDraft({
            fullname: user.fullname || "",
            phone: user.phone || "",
            email: user.email || "",
            sex: user.sex || "Others",
            birthday: user.birthday ? user.birthday.split('T')[0] : "",
            address: user.address || ""
        });
        setIsEditing(false);
    };

    const saveEditing = () => {
        const formData = new FormData();
        formData.append("fullname", draft.fullname);
        formData.append("phone", draft.phone);
        formData.append("address", draft.address);
        formData.append("sex", draft.sex);
        formData.append("birthday", draft.birthday);

        // Gửi lên Server
        updateMutation.mutate(formData);
    };

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
                    <input type="text" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.email} disabled className={styles.disabledInput} /> {/* Email không cho sửa */}

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