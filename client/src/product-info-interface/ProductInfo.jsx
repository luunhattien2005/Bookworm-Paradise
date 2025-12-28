import { useState, useContext } from "react" 
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useGetBookBySlug } from "../hooks/useBooks"
import { useReviews, useAddReview } from "../hooks/useReview" 

import DOMPurify from "dompurify"
import styles from "./Product.module.css"
import { AuthContext } from "../auth-interface/AuthContext"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import Loading from "../header-footer-interface/Loading"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addToCart } from "../api/cart"

import YourRating from "./YourRating"
import RatingItem from "./RatingItem"

export default function ProductInfo() {
    const queryClient = useQueryClient()
    const { slug } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useContext(AuthContext)

    // 1. Lấy thông tin sách
    const {
        data: product,
        isLoading: loadingProduct,
        isError,
        error
    } = useGetBookBySlug(slug);

    // 2. Add to Cart Mutation
    const addCartMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"])
            alert("Đã thêm vào giỏ hàng!")
        },
        onError: (err) => alert(err.response?.data?.message || "Lỗi thêm giỏ hàng")
    })

    // 3. Lấy Reviews (Infinite Scroll)
    // Chỉ gọi khi đã có product._id
    const {
        data: reviewData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: loadingReviews
    } = useReviews(product?._id, 5); // 5 review mỗi lần load

    // 4. Add Review Mutation
    const addReviewMutation = useAddReview(product?._id);

    const handleSubmitReview = (data) => {
        addReviewMutation.mutate(data, {
            onSuccess: () => alert("Đánh giá thành công!"),
            onError: (err) => alert(err.response?.data?.message || "Lỗi gửi đánh giá")
        })
    }

    if (loadingProduct) return <Loading />;
    if (isError) return <Loading error={true} message={error.message} />;

    // Gộp tất cả các trang review thành 1 mảng duy nhất
    const allReviews = reviewData?.pages.flatMap(page => page.reviews) || [];

    // Logic hiển thị khung đánh giá
    let show_rating;
    if (!user) {
        show_rating = (
            <p>Vui lòng <Link style={{color: "blue"}} to="/auth" state={{ from: location.pathname }}>đăng nhập</Link> để đánh giá sản phẩm.</p>
        )
    } else {
        show_rating = (
            <YourRating onSubmit={handleSubmitReview} />
        )
    }

    return(
        <>
            <PageNameHeader pagename="Product"/>
                        
            <main className={styles.container}>
                {/* --- PHẦN TOP PRODUCT (GIỮ NGUYÊN) --- */}
                <div className={styles.topProduct}>
                    <img src={product.imgURL} alt="Product Picture" />
                    <div className={styles.information1st}>
                        <button className={styles.addLiked}><i className="fa-regular fa-heart fa-2x1" style={{ fontSize: "30px"}}></i></button>

                        <p className={styles.informationName}>{product.name}</p>
                        <p className={styles.informationAuthor}>Tác giả: {product.author?.AuthorName}</p>

                        <div className={styles.informationTag}>
                            {product.tags && product.tags.length > 0 ? (
                                product.tags.map(tag => (
                                <a href="#" key={tag._id}>{tag.name}</a>
                                ))
                            ) : (<span className={styles.noTag}>Không có thể loại</span>)}
                        </div>

                        <p className={styles.informationPrice}>{product.price.toLocaleString("vi-VN")} VND</p>
                        
                        <button 
                            className={styles.informationAdd}
                            onClick={() => !user ? navigate("/auth", { state: { from: location.pathname } }) : addCartMutation.mutate({ bookId: product._id, quantity: 1 })}
                        >
                                Thêm vào giỏ hàng
                        </button>

                        <div className={styles.informationDetails}>
                            {/* ... (Giữ nguyên bảng chi tiết) ... */}
                            <p>Thông tin chi tiết</p>
                            <div>
                                <ul style={{ width: "220px", padding: "7px"}}>
                                    <li>Mã hàng</li><li>Tên nhà cung cấp</li><li>Tác giả</li><li>Người dịch</li><li>Nhà xuất bản</li><li>Năm xuất bản</li><li>Trọng lượng (gr)</li><li>Kích thước bao bì</li><li>Số trang</li><li>Hình thức</li>
                                </ul>
                                <ul style={{width: "240px", padding: "7px"}}>
                                    <li>{product._id.substring(0,8)}...</li>
                                    <li>{product.provider}</li>
                                    <li>{product.author?.AuthorName}</li>
                                    <li>{product.translator}</li>
                                    <li>{product.publisher}</li>
                                    <li>{product.publicationYear}</li>
                                    <li>{product.weight}</li>
                                    <li>{product.size}</li>
                                    <li>{product.page}</li>
                                    <li>{product.type}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>   

                <div className={styles.middleProduct}>
                    <p className={styles.middleProductTitle}>Mô tả sản phẩm</p>
                    <div className={styles.middleProductInformation} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.description)}} />
                </div> 

                {/* --- PHẦN RATING (CẬP NHẬT) --- */}
                <div className={styles.ratingSection}>
                    <p className={styles.ratingEditorTitle}>Đánh giá sản phẩm</p>
                    {show_rating}
                    
                    <br/>
                    <p className={styles.ratingEditorTitle}>Đánh giá từ khách hàng ({allReviews.length})</p>
                    
                    {loadingReviews ? (
                        <p>Đang tải đánh giá...</p>
                    ) : allReviews.length === 0 ? (
                        <p style={{fontStyle: "italic", color: "gray"}}>Chưa có đánh giá nào.</p>
                    ) : (
                        allReviews.map(r => (
                            <RatingItem key={r._id} rating={r} />
                        ))
                    )}

                    {/* Nút Xem thêm */}
                    {hasNextPage && (
                        <div style={{textAlign: "center", marginTop: "10px"}}>
                            <button 
                                onClick={() => fetchNextPage()} 
                                disabled={isFetchingNextPage}
                                style={{padding: "8px 16px", cursor: "pointer"}}
                            >
                                {isFetchingNextPage ? "Đang tải..." : "Xem thêm đánh giá cũ hơn"}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}