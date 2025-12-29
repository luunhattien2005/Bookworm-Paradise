import { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css"; 
import Loading from "../header-footer-interface/Loading";
import { useWishlist, useRemoveFromWishlist } from "../hooks/useWishlist";

export default function Favorites() {
    // Lấy dữ liệu wishlist
    const { data: wishlist, isLoading } = useWishlist();
    
    // Hook xóa sách
    const removeMutation = useRemoveFromWishlist({
        onSuccess: () => alert("Đã xóa khỏi danh sách yêu thích!")
    });

    if (isLoading) return <Loading />;

    const books = wishlist?.books || [];

    if (books.length === 0) {
        return (
            <div className={styles.rightContainer}>
                <p>Sách yêu thích</p>
                <div style={{textAlign: "center", marginTop: "50px", color: "gray"}}>
                    <p style={{fontSize: "20px"}}>Bạn chưa thích cuốn sách nào cả 😢</p>
                    <Link to="/home" style={{color: "#e7c66a", textDecoration: "none", fontWeight: "bold"}}>
                        Khám phá sách ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.rightContainer}>
            <p>Sách yêu thích ({books.length})</p>
            
            <div style={{ display: "grid", gap: "20px" }}>
                {books.map(book => (
                    <div key={book._id} style={{
                        display: "flex", 
                        gap: "20px", 
                        padding: "15px", 
                        border: "1px solid #eee", 
                        borderRadius: "10px",
                        background: "white",
                        alignItems: "center"
                    }}>
                        {/* Ảnh sách */}
                        <Link to={`/product/${book.slug}`}> 
                             <img 
                                src={book.imgURL} 
                                alt={book.name} 
                                style={{ width: "80px", height: "120px", objectFit: "cover", borderRadius: "5px" }}
                            />
                        </Link>

                        {/* Thông tin */}
                        <div style={{ flex: 1 }}>
                            <Link to={`/product/${book.slug}`} style={{ textDecoration: "none", color: "black" }}>
                                <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>{book.name}</h3>
                            </Link>
                            <p style={{ margin: "0 0 10px 0", color: "gray", fontSize: "14px" }}>
                                {book.author?.AuthorName || "Tác giả đang cập nhật"}
                            </p>
                            <span style={{ fontWeight: "bold", color: "#d32f2f" }}>
                                {book.price?.toLocaleString()} đ
                            </span>
                        </div>

                        {/* Nút xóa */}
                        <button 
                            onClick={() => {
                                if(confirm("Bỏ thích sách này?")) {
                                    removeMutation.mutate(book._id);
                                }
                            }}
                            style={{
                                padding: "8px 15px",
                                border: "1px solid #ff4444",
                                background: "white",
                                color: "#ff4444",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Bỏ thích
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}