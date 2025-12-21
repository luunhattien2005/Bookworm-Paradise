import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { useParams } from "react-router-dom"
import DOMPurify from "dompurify"
import styles from "./Product.module.css"
import { AuthContext } from "../auth-interface/AuthContext"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addToCart } from "../header-footer-interface/api/cart"

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
    const [product, setProduct] = useState(null)

    // useEffect(() => {
    //     fetch(`/api/products/${slug}`)
    //         .then(res => res.json())
    //         .then(data => setProduct(data));
    // }, [slug]);

    // inject sản phẩm giả
    useEffect(() => {
        // fake API
        let fake_product;
        if (slug !== "triet-hoc-mac-lenin") {
            fake_product = {
                name: "Nếu Gặp Lại Em Trên Ngọn Đồi Hoa Nở",
                author: "Natsue Siomi",
                slug: slug,
                price: 120000,
                stock: 10,
                imgURL: "https://cdn1.fahasa.com/media/catalog/product/n/_/n_u-g_p-l_i-em-tr_n-ng_n-_i-hoa-n_.jpg",
                id: 8935325018343,
                provider: "AZ Vietnam",
                translator: "Hoàng Duy Khang",
                publisher: "NXB Thế Giới",
                year: 2023,
                weight: 330,
                size: "18 x 13 x 1.5 cm",
                pages: 312,
                type: "Bìa mềm",
                desc: `
                    <p>Nếu Gặp Lại Em Trên Ngọn Đồi Hoa Nở</p>
                    <p>Mối lương duyên vượt thời gian. Dù không bao giờ gặp lại, kỷ niệm vẫn khắc sâu trong trái tim.</p>
                    <p>Yuri, một nữ sinh lớp 8, đã trải qua những ngày tháng chán ghét trường lớp và người mẹ của mình. Ngày nọ, sau khi cãi nhau với mẹ, cô bé quyết định bỏ nhà ra đi. Lần tiếp theo mở mắt, Yuri phát hiện bản thân đã xuyên không đến Nhật Bản 70 năm trước. Cô được một chàng trai tên Akira tình cờ đi ngang qua cứu giúp. Sau những ngày tháng kề bên, Yuri dần đem lòng cảm mến người con trai này. Tuy nhiên, là một phi công cảm tử, Akira có nhiệm vụ phải bay đến chiến trường và xả thân vì quốc gia... Cuối cùng Yuri cũng biết được tình cảm thật sự mà Akira dành cho mình.</p>
                    `
            };
        } else {
            fake_product = {
                name: "Triết học Mác Lênin",
                author: "Mác Lênin",
                slug: slug,
                price: 80000,
                stock: 3,
                imgURL: "https://cdn1.fahasa.com/media/catalog/product/8/9/8935279153367.jpg",
                id: 8935235226272,
                provider: "Nhã Nam",
                translator: "Không",
                publisher: "NXB Hội nhà văn",
                year: 2020,
                weight: 220,
                size: "20.5 x 13 cm",
                pages: 227,
                type: "Bìa mềm",
                desc: `
                    <p>NHÀ GIẢ KIM - HÀNH TRÌNH ĐI TÌM KHO BÁU HAY CUỘC HÀNH TRÌNH TÌM KIẾM CHÍNH MÌNH</p>
                    <p>"Nhà Giả Kim" không đơn thuần là một cuốn tiểu thuyết, mà là bản đồ dẫn lối đến giấc mơ, khao khát và định mệnh của mỗi con người. Câu chuyện về chàng trai chăn cừu Santiago không chỉ mang đến những cuộc phiêu lưu hấp dẫn, mà còn mở ra nhiều tầng triết lý sâu sắc về cuộc sống.</p>
                    <ul>VỀ TÁC GIẢ: Paulo Coelho
                        <li>Là nhà văn người Brazil, bậc thầy kể chuyện với lối viết đậm chất triết lý.</li>
                        <li>Ông là tác giả của nhiều tác phẩm truyền cảm hứng, trong đó "Nhà Giả Kim" là cuốn sách nổi tiếng nhất, được dịch ra hơn 80 ngôn ngữ và bán hàng triệu bản trên toàn thế giới.</li>
                        <li>Các tác phẩm khác của ông như "Veronika quyết chết", "Nhà tiên tri" hay "Phù thủy thành phố Portobello" cũng để lại dấu ấn sâu sắc trong lòng độc giả.</li>
                    </ul>
                    <ul>VỀ DỊCH GIẢ: Lê Chu Cầu
                        <li>Là dịch giả có nhiều đóng góp trong việc đưa văn học nước ngoài đến với độc giả Việt Nam.</li>
                        <li>Ông đã chuyển ngữ nhiều tác phẩm kinh điển, trong đó bản dịch "Nhà Giả Kim" của ông được đánh giá cao bởi sự mượt mà, giàu cảm xúc và giữ trọn vẹn tinh thần triết lý của Paulo Coelho.</li>
                    </ul>
                    <p>TÓM TẮT NỘI DUNG SÁCH</p>
                    <p>Santiago - một chàng trai chăn cừu trẻ tuổi, rời quê hương để theo đuổi giấc mơ tìm kho báu ở Kim Tự Tháp Ai Cập. Trên hành trình ấy, anh gặp gỡ nhiều người, từ ông vua thông thái, người buôn pha lê đến Nhà Giả Kim huyền bí. Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.</p>
                    <P>Mỗi cuộc gặp gỡ không chỉ giúp anh tiến gần hơn đến kho báu mà còn giúp anh hiểu được mục đích thật sự của đời mình: </P>
                    <p>Trích Nhà giả Kim: "Kho báu không nằm ở nơi ta đến, mà nằm trong chính hành trình ta đi."</p>

                    `
            };
        }

        setProduct(fake_product);
    }, []);

    

    // Load rating
    const [ratings, setRatings] = useState([])
    const [cursor, setCursor] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const LIMIT = 5    

    const fetchRatings = async () => {
        if (!hasMore) return

        const params = new URLSearchParams({
            productId: product.id,
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
    const loaction = useLocation();
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

    if (!product) return <div>Loading...</div>
    return(
        <>
            <PageNameHeader pagename="Product"/>
                        
            <main className={styles.container}>
                <div className={styles.topProduct}>
                    <img src={product.imgURL} alt="Product Picture" />

                    <div className={styles.information1st}>
                        <button className={styles.addLiked}><i className="fa-regular fa-heart fa-2x1" style={{ fontSize: "30px"}}></i></button>

                        <p className={styles.informationName}>{product.name}</p>
                        <p className={styles.informationAuthor}>Tác giả: {product.author}</p>

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
                            onClick={() => addCartMutation.mutate(product)}
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
                                    <li>{product.id}</li>
                                    <li>{product.provider}</li>
                                    <li>{product.author}</li>
                                    <li>{product.translator}</li>
                                    <li>{product.publisher}</li>
                                    <li>{product.year}</li>
                                    <li>{product.weight}</li>
                                    <li>{product.size}</li>
                                    <li>{product.pages}</li>
                                    <li>{product.type}</li>
                                </ul>
                            </div>  
                        </div>
                    </div>
                </div>   

                <div className={styles.middleProduct}>
                    <p className={styles.middleProductTitle}>Mô tả sản phẩm</p>

                    <div className={styles.middleProductInformation} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.desc)}} /> {/* render raw HTML*/}
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