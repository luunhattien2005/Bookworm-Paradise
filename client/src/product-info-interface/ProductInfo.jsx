import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useGetBookBySlug } from "../hooks/useBooks"

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

    const addCartMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"])
        }
    })

    const { slug } = useParams()
    const navigate = useNavigate()

    const {
        data: product,
        isLoading,
        isError,
        error
    } = useGetBookBySlug(slug);

    // Load rating
    
    const [ratings, setRatings] = useState([])
    const [cursor, setCursor] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const LIMIT = 5    

    const fetchRatings = async () => {
        if (!hasMore) return

        const params = new URLSearchParams({
            productId: product._id,
            limit: LIMIT
        })

        if (cursor) {
            params.append("cursor", cursor)
        }

        const res = await fetch(`/api/ratings?${params}`)
        const data = await res.json()

        setRatings(prev => [...prev, ...data.ratings])
        setCursor(data.nextCursor)
        setHasMore(data.hasMore)    
    }

    const fakeRatings = [
        { id: 1, productId: 8935235226272, star: 3, content: "<p>Rating bau troi co 1 co doi khong muon ve nha, xin au lo khong ve noi day, xin cho ta duoc ngam<p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Suspendisse luctus cursus nisi in rutrum. Sed iaculis lectus neque, id tempor neque pellentesque nec. Suspendisse tristique dictum risus, id tempor lacus suscipit sed. Praesent arcu turpis, euismod eleifend magna nec, tristique luctus dolor. Maecenas ultrices nisl sed consequat posuere. Nunc sit amet facilisis sem. In in neque sollicitudin, volutpat quam dictum, aliquet ligula. Sed suscipit justo a massa pretium venenatis. Aenean ultrices est ac ultrices sagittis. Pellentesque in lorem interdum urna vestibulum ornare non quis odio. Ut quis ultricies nibh, at tincidunt purus. Sed a urna ac quam ullamcorper pellentesque in sed arcu. Aliquam erat volutpat. Nam commodo enim orci, sed congue sem commodo ac. Integer quis elit et magna sodales interdum non vitae erat. Vestibulum ut sagittis tortor.</p>", user: {username: "LNTien", img_url: "https://dummyimage.com/50/000/fff"}, createdAt: "2025-12-15T10:30:00Z" },
        { id: 2, productId: 8935235226272, star: 5, content: "<p>Rating 2<p>", user: {username: "LNTien", img_url: "https://dummyimage.com/50/000/fff"}, createdAt: "2025-12-14T21:12:00Z" },
        { id: 3, productId: 8935235226272, star: 1, content: "<p>Rating 3<p>", user: {username: "LNTien", img_url: "https://dummyimage.com/50/000/fff"}, createdAt: "2025-12-14T08:45:00Z" },
        { id: 4, productId: 8935235226272, star: 2, content: "<p>Rating 4<p>", user: {username: "LNTien", img_url: "https://dummyimage.com/50/000/fff"}, createdAt: "2025-12-13T19:20:00Z" },
        { id: 5, productId: 8935235226272, star: 4, content: "<p>Rating 5<p>", user: {username: "LNTien", img_url: "https://dummyimage.com/50/000/fff"}, createdAt: "2025-12-12T22:05:00Z" }
    ]    

    useEffect(() => {
        // giả lập fetch server
        const timer = setTimeout(() => {
            setRatings(fakeRatings)
            setCursor(fakeRatings[fakeRatings.length - 1].createdAt)
            setHasMore(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])    

    // Check login
    const location = useLocation();
    const { user } = useContext(AuthContext)

    let show_rating;
    if (!user) {
        show_rating = (
            <p>Vui lòng <Link style={{color: "blue"}} to="/auth" state={{ from: location.pathname }}>đăng nhập</Link> để đánh giá sản phẩm.</p>
        )
    } else {
        show_rating = (
            <YourRating />
        )
    }

    if (isLoading) return <Loading />;
    if (isError) return <Loading error={true} message={error.message} />;

    return(
        <>
            <PageNameHeader pagename="Product"/>
                        
            <main className={styles.container}>
                <div className={styles.topProduct}>
                    <img src={product.imgURL} alt="Product Picture" />

                    <div className={styles.information1st}>
                        <button className={styles.addLiked}><i className="fa-regular fa-heart fa-2x1" style={{ fontSize: "30px"}}></i></button>

                        <p className={styles.informationName}>{product.name}</p>
                        <p className={styles.informationAuthor}>Tác giả: {product.author.AuthorName}</p>

                        <div className={styles.informationTag}>
                            <a href="#">Horror</a>
                            <a href="#">Funny</a>
                            <a href="#">Drama</a>
                            <a href="#">Adult</a>
                            <a href="#">Math</a>
                        </div>

                        <p className={styles.informationPrice}>{product.price}VND</p>
                        
                        <button 
                            className={styles.informationAdd}
                            onClick={() => {!user ? navigate("/auth", { state: { from: location.pathname } }) :
                                addCartMutation.mutate({ bookId: product._id, quantity: 1 })
                            }}
                        >
                                Thêm vào giỏ hàng
                        </button>

                        <div className={styles.informationDetails}>
                            <p>Thông tin chi tiết</p>

                            <div>
                                <ul style={{ width: "220px", padding: "7px"}}>
                                    <li>Mã hàng</li>
                                    <li>Tên nhà cung cấp</li>
                                    <li>Tác giả</li>
                                    <li>Người dịch</li>
                                    <li>Nhà xuất bản</li>
                                    <li>Năm xuất bản</li>
                                    <li>Trọng lượng (gr)</li>
                                    <li>Kích thước bao bì</li>
                                    <li>Số trang</li>
                                    <li>Hình thức</li>
                                </ul>

                                <ul style={{width: "240px", padding: "7px"}}>
                                    <li>{product._id}</li>
                                    <li>{product.provider}</li>
                                    <li>{product.author.AuthorName}</li>
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

                    <div className={styles.middleProductInformation} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.description)}} /> {/* render raw HTML*/}
                </div> 

                <div className={styles.ratingSection}>
                    <p className={styles.ratingEditorTitle}>Đánh giá sản phẩm</p>
                    {show_rating}
                    <br/>
                    <p className={styles.ratingEditorTitle}>Đánh giá mới nhất</p>
                    
                    {ratings.map(r => (
                        <RatingItem key={r.id} rating={r} />
                    ))}
                    {hasMore && (
                        <button onClick={fetchRatings}>
                            Xem thêm đánh giá
                        </button>
                    )}
                </div>
            </main>
        </>
    )
}