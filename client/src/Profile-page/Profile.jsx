import { useContext } from 'react';
import { AuthContext } from '../auth-interface/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from "./Profile.module.css";
import PageNameHeader from '../header-footer-interface/PageNameHeader';

export default function Profile() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    return (
    <>
        <PageNameHeader pagename="Profile"/>

        <main className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.upperContainer}>
                    <div className={styles.ProfilePicture}>
                        <i className="material-symbols-outlined">photo_camera_front</i>
                        <img src="/img/PP_Large.png" alt="Picture Profile here"></img>
                    </div>

                    <p>Lưu Nhật Tiến</p>
                </div>

                <div className={styles.lowerContainer}>
                    <p>Hồ sơ cá nhân</p>
                    <p>Thay đổi mật khẩu</p>
                    <p>Sách yêu thích</p>
                    <p>Lịch sử mua hàng</p>
                    <p>Trung tâm thông báo</p>
                    <p>This is useless button</p>
                    <p style={{color: "rgb(255, 0, 0)"}} onClick={() => { navigate("/logout")}}>Đăng xuất</p>
                </div>
            </div>
        </main>




    </>)
}
