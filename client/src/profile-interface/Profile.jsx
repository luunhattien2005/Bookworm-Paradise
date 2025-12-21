import { useContext } from 'react';
import { AuthContext } from '../auth-interface/AuthContext';
import { useNavigate , useLocation} from 'react-router-dom';
import styles from "./Profile.module.css";
import PageNameHeader from '../header-footer-interface/PageNameHeader';
import Information from './Infomation';

export default function Profile() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { label: "Hồ sơ cá nhân", action: "info" },
        { label: "Thay đổi mật khẩu", action: "password" },
        { label: "Sách yêu thích", action: "favorites" },
        { label: "Lịch sử mua hàng", action: "bills" },
        { label: "Trung tâm thông báo", action: "notifications" }
    ];

    function handleMenuClick(action) {
        switch (action) {
            case "info":
                navigate("/profile/info");
                break;
            case "password":
                navigate("/profile/password");
                break;
            case "favorites":
                navigate("/profile/favorites");
                break;
            case "bills":
                navigate("/profile/bills");
                break;
            case "notifications":
                navigate("/profile/notifications");
                break;
            default:
                break;
        }
    }

    return (
    <>
        <PageNameHeader pagename="Profile"/>

        <main className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.upperContainer}>
                    <div className={styles.ProfilePicture}>
                        <i className="material-symbols-outlined">photo_camera_front</i>
                        <img src={user.avatar ? user.avatar : "/img/PP_Large.png"}></img>
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

                    <p>This is useless button</p>
                    <p style={{color: "rgb(255, 0, 0)"}} onClick={() => { navigate("/logout")}}>Đăng xuất</p>
                </div>
            </div>

            {location.pathname ==="/profile/info" && <Information />}





        </main>




    </>)
}
