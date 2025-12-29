import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./Home.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import Loading from "../header-footer-interface/Loading" // Import thêm Loading

// Import Hook mới
import { useTopRatedBooks, useBestSellers, useSeasonalBooks } from "../hooks/useBooks"

// Ảnh huy chương giữ nguyên
import medal1 from "./img/medal1.png"
import medal2 from "./img/medal2.png"
import medal3 from "./img/medal3.png"


export default function HomePage() {
    // 1. Lấy dữ liệu từ Backend
    const { data: topRated = [], isLoading: load1 } = useTopRatedBooks();
    const { data: seasonal = [], isLoading: load2 } = useSeasonalBooks("SEASON");
    const { data: bestSellers = [], isLoading: load3 } = useBestSellers();

    const [active, setActive] = useState(0)
    if (load1 || load2 || load3) return <Loading />;

    // Dữ liệu cho Bảng xếp hạng (Huy chương)
    const medals = [medal1, medal2, medal3];

    return(
        <>
            <PageNameHeader pagename="Home"/>

            <a className={styles.MessagerContainer} href="https://www.facebook.com/quan.chu.86787#">
                <img src="/img/Messager_Logo.png" className={styles.Messager} alt="chat" />
            </a>
            
            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>NỔI BẬT</div>
                <div id={styles.displayContent1}>
                    <div className={styles.stackWrapper}>
                        {topRated.length > 0 ? topRated.map((book, i) => {
                            const pos = (i - active + topRated.length) % topRated.length;
                            return (
                                <Link to={`/product/${book.slug}`} key={book._id}>
                                    <img
                                        src={book.imgURL}
                                        className={`${styles.card} ${styles[`pos${pos}`]}`}
                                        alt={book.name}
                                    />
                                </Link>
                            );
                        }) : <p style={{textAlign:"center"}}>Đang cập nhật sách nổi bật...</p>}
                    </div>

                    <div className={styles.controls}>
                        {topRated.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`${styles.dot} ${active === i ? styles.active : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>           

            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>BỘ SƯU TẬP THEO MÙA</div>
                <div id={styles.displayContent2}>
                    {seasonal.length > 0 ? seasonal.map((book) => (
                        <Link to={`/product/${book.slug}`} key={book._id}>
                            <img 
                                src={book.imgURL}
                                className={`${styles.img_s}`}
                                alt={book.name}
                                title={book.name} 
                            />
                        </Link>
                    )) : <p>Chưa có bộ sưu tập cho mùa này</p>}
                </div>
            </div>           

            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>BẢNG XẾP HẠNG HÀNG TUẦN</div>
                <div id={styles.displayContent3}>
                    {bestSellers.length > 0 ? bestSellers.map((book, i) => (
                        <Link 
                            to={`/product/${book.slug}`} 
                            key={book._id} 
                            className={`${styles.rankItem} ${styles[`rank${i + 1}`]}`}
                        >
                            <img 
                                src={book.imgURL} 
                                className={styles.img_w} 
                                alt={book.name}
                                style={{boxShadow: "0 5px 15px rgba(0,0,0,0.3)"}} 
                            />
                            {medals[i] && (
                                <img
                                    src={medals[i]}
                                    className={styles.medal}
                                    alt={`Rank ${i+1}`}
                                />
                            )}
                        </Link>
                    )) : <p>Đang cập nhật bảng xếp hạng...</p>}
                </div>
            </div>      
        </>
    )
}