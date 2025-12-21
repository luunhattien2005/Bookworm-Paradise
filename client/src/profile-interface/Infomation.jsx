import styles from "./Profile.module.css";
import { AuthContext } from '../auth-interface/AuthContext';
import { useContext , useState } from 'react';

export default function Information() {
    const { user } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false);

    // Saved data (source of truth)
    const [profile, setProfile] = useState({
        fullname: user.fullname,
        phone: user.phone,
        email: user.email,
        sex: user.sex || "Others",
        birthday: user.birthday,
        address: user.address
    });

    // Draft data (temporary edits)
    const [draft, setDraft] = useState(profile)

    const cancelEditing = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const saveEditing = () => {
        setProfile(draft);     // later send to DB
        setIsEditing(false);
    };

    return (
        <div className={styles.rightContainer}>
            <p>Hồ sơ cá nhân</p>

            <div className={styles.information}>
                <div className={styles.informationFirstDiv}>
                    <label htmlFor="Fullname">Họ tên</label>
                    <label htmlFor="Phone">Số điện thoại</label>
                    <label htmlFor="Email">Email</label>
                    <label htmlFor="Sex">Giới tính</label>
                    <label htmlFor="Birthday">Ngày sinh</label>
                    <label htmlFor="Address">Địa chỉ nhận hàng</label>
                </div>

                <div className={styles.informationSecondDiv}>
                    <input type="text" value={draft.fullname} onChange={(e) =>setDraft({ ...draft, fullname: e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.phone}    onChange={(e) =>setDraft({ ...draft, phone:    e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.email}    onChange={(e) =>setDraft({ ...draft, email:    e.target.value })} readOnly={!isEditing} />

                    <select name="Sex" value={user.sex || "Others"} onChange={(e) =>setDraft({ ...draft, sex: e.target.value })} disabled={!isEditing}>
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Others</option>
                    </select>

                    <input type="date" value={draft.birthday} onChange={(e) =>setDraft({ ...draft, birthday: e.target.value })} readOnly={!isEditing} />
                    <input type="text" value={draft.address}  onChange={(e) =>setDraft({ ...draft, address:  e.target.value })} readOnly={!isEditing} />
                </div>
            </div>

            <div className={styles.informationButton}>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)}> Thay đổi Thông Tin </button>
                )}

                {isEditing && (
                    <>
                    <button style={{ color: "lightcoral" }} onClick={() => cancelEditing()}> Hủy bỏ </button>
                    <button onClick={() => saveEditing(false)}> Lưu thay đổi </button>
                    </>
                )}
            </div>
        </div>









    )
}