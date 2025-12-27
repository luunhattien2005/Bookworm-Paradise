import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./Home.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

import banner1 from "./img/nha_gia_kim_p.jpg"
import banner2 from "./img/combo_p.jpg"
import banner3 from "./img/cay_cam_ngot_p.png" 

import medal1 from "./img/medal1.png"
import medal2 from "./img/medal2.png"
import medal3 from "./img/medal3.png"

export default function HomePage() {
    // Nổi bật - note ảnh request từ server
    const images_popular = [
        {banner: banner1, linkTo: "/product/nha-gia-kim"},
        {banner: banner2, linkTo: "/product/suoi-am-mat-troi"},
        {banner: banner3, linkTo: "/product/cay-cam-ngot-cua-toi"}
    ]
    // Index of image currently on top
    const [active, setActive] = useState(0)
    // return index with circular order
    const getIndex = (offset) => (active + offset) % images.length;

    // Bộ sưu tập theo mùa - note ảnh request từ server
    const images_s = [
        "https://m.media-amazon.com/images/I/811qCwNYYFL._SY466_.jpg",
        "https://m.media-amazon.com/images/I/811qCwNYYFL._SY466_.jpg",
        "https://m.media-amazon.com/images/I/811qCwNYYFL._SY466_.jpg"
    ]

    // Bảng xếp hạng hằng tuần 
    const medal = [
        medal1,
        medal2,
        medal3
    ]

    const images_w = [
        "https://cdn1.fahasa.com/media/catalog/product/b/i/bia-2d_ho-diep-va-kinh-ngu_17307_1.jpg",
        "https://cdn1.fahasa.com/media/catalog/product/b/i/bia-2d_ho-diep-va-kinh-ngu_17307_1.jpg",
        "https://cdn1.fahasa.com/media/catalog/product/b/i/bia-2d_ho-diep-va-kinh-ngu_17307_1.jpg"
    ] 

    return(
        <>
            <PageNameHeader pagename="Home"/>
            
            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>
                    NỔI BẬT
                </div>
                <div id={styles.displayContent1}>
                    <div className={styles.stackWrapper}>
                        {images_popular.map(({banner, linkTo}, i) => {
                            // position: 0 = top, 1 = middle, 2 = back
                            const pos = (i - active + images_popular.length) % images_popular.length;
                            return (
                                <Link to={linkTo} key={i}>
                                    <img
                                        src={banner}
                                        className={`${styles.card} ${styles[`pos${pos}`]}`}
                                        alt="featured book"
                                    />
                                </Link>
                            );
                        })}
                    </div>


                    <div className={styles.controls}>
                        {images_popular.map((_, i) => (
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
                <div className={styles.displayTitle}>
                    BỘ SƯU TẬP THEO MÙA
                </div>
                <div id={styles.displayContent2}>
                    {images_s.map((link, i) => (
                        <img 
                            key={i} 
                            src={link}
                            className={`${styles.img_s}`}
                        />
                    ))}
                </div>
            </div>           

            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>
                    BẢNG XẾP HẠNG HÀNG TUẦN
                </div>
                <div id={styles.displayContent3}>
                    {images_w.map((link, i) => (
                        <div key={i} className={`${styles.rankItem} ${styles[`rank${i + 1}`]}`}>

                            <img src={link} className={styles.img_w}/>
                            <img
                                src={medal[i]}
                                className={styles.medal}
                            />
                        </div>
                    ))}
                </div>
            </div>      

            
        </>
    )
}