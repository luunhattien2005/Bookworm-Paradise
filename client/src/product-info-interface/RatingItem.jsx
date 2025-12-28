import { useContext } from "react";
import DOMPurify from "dompurify";
import styles from "./Product.module.css";
import { AuthContext } from "../auth-interface/AuthContext";
import { useDeleteReview } from "../hooks/useReview";

export default function RatingItem({ rating }) {
  const { user } = useContext(AuthContext);
  const deleteMutation = useDeleteReview();

  // Xử lý ngày tháng
  const date = new Date(rating.createdAt); // Backend dùng createdAt
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const day = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Xử lý hiển thị Avatar (Backend trả về đường dẫn file, cần thêm localhost)
  // Nếu backend trả về 'uploads/abc.jpg' thì phải nối thêm URL server
  const avatarSrc = rating.user?.avatar 
    ? (rating.user.avatar.startsWith("http") ? rating.user.avatar : `http://localhost:5000/${rating.user.avatar}`)
    : "https://via.placeholder.com/50";

  // Check quyền xóa
  const canDelete = user && (user.role === 'admin' || user._id === rating.user._id);

  return (
    <div className={styles.ratingContainer} style={{ position: "relative" }}>
      {/* Nút xóa */}
      {canDelete && (
          <button 
            onClick={() => {
                if(confirm("Xóa đánh giá này?")) deleteMutation.mutate(rating._id);
            }}
            style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", color: "red", cursor: "pointer"}}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
      )}

      <div className={styles.ratingProfile}>
        <img src={avatarSrc} alt="avatar" style={{objectFit: "cover"}} />
        <p style={{fontWeight: "bold", fontSize: "13px"}}>
            {rating.user?.fullname || "Người dùng ẩn danh"}
        </p>
        <p>{time}</p>
        <p>{day}</p>
      </div>

      <div className={styles.ratingContent}>
        <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(i => (
                <i
                key={i}
                className={
                    i <= rating.star // Backend phải trả về field 'star'
                    ? `fa-solid fa-star ${styles.starFilled}`
                    : `fa-regular fa-star ${styles.starEmpty}`
                }
                />
            ))}
        </div>

        <div className={styles.ratingHTML} dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(rating.content) // Backend phải trả về field 'content'
        }} />
      </div>
    </div>
  )
}