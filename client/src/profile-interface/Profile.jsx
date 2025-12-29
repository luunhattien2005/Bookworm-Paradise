import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth-interface/AuthContext';
import { useNavigate , useLocation} from 'react-router-dom';
import styles from "./Profile.module.css";
import PageNameHeader from '../header-footer-interface/PageNameHeader';
import Information from './Infomation'; 
import Favorites from './Favorites';
import ChangePassword from './ChangePassword';
import { useUpdateUser } from "../hooks/useAuth";
import BillList from './BillList';
import Notification from './Notification';

export default function Profile() {
    const { user, refreshUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const updateMutation = useUpdateUser({
        onSuccess: async () => {
            if (refreshUser) await refreshUser(); // Gọi hàm làm mới dữ liệu
            alert("Cập nhật ảnh đại diện thành công!");
        },
        onError: (err) => {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file); 
            updateMutation.mutate(formData);
        }
    }

    const menuItems = [
        { label: "Hồ sơ cá nhân", action: "info" },
        { label: "Thay đổi mật khẩu", action: "password" },
        { label: "Sách yêu thích", action: "favorites" },
        { label: "Lịch sử mua hàng", action: "bills" },
        // { label: "Trung tâm thông báo", action: "notifications" }
    ];

    function handleMenuClick(action) {
        navigate(`/profile/${action}`);
    }

    // Xử lý an toàn: Nếu user chưa load xong thì không render phần dưới để tránh crash
    if (!user) return <div style={{padding: "50px", textAlign:"center"}}>Đang tải thông tin...</div>;

    const BASE_URL = import.meta.env.VITE_API_URL;
    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith('http')
            ? user.avatar
            : `${BASE_URL}/${user.avatar}?t=${user.updatedAt}`)
        : "/img/PP_Large.png";

    return (
    <>
        <PageNameHeader pagename="Profile"/>

        <main className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.upperContainer}>
                    <div className={styles.ProfilePicture}>
                        <input 
                            type="file" 
                            id="avatarUpload" 
                            style={{display: 'none'}} 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                         <label htmlFor="avatarUpload" style={{cursor: "pointer"}}>
                            <i className="material-symbols-outlined">photo_camera_front</i>
                            <img 
                                src={avatarUrl} 
                                alt="Avatar"
                                style={{ objectFit: "cover" }}
                                onError={(e) => e.target.src = "/img/PP_Large.png"}
                            />
                        </label>
                    </div>
                    <p>{user.fullname}</p>
                </div>

                <div className={styles.lowerContainer}>
                    {menuItems.map((item, index) => (
                        <p
                            key={index}
                            onClick={() => handleMenuClick(item.action)}
                            className={(location.pathname === "/profile/" + item.action) ? styles.leftChoosing : ''}
                        >
                            {item.label}
                        </p>
                    ))}
                    {/* <p>None working button</p> */}
                    <p style={{color: "rgb(255, 0, 0)"}} onClick={() => { navigate("/logout")}}>Đăng xuất</p>
                </div>
            </div>

            {location.pathname ==="/profile/info" && <Information />}
            {location.pathname ==="/profile/password" && <ChangePassword />}
            {location.pathname ==="/profile/favorites" && <Favorites />}
            {location.pathname ==="/profile/bills" && <BillList/>}
            {/* {location.pathname ==="/profile/notifications" && <Notification/>} */}
            {/* Placeholder cho các tab chưa làm */}
        </main>
    </>
    )}