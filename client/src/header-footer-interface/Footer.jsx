import styles from "./HeaderFooter.module.css"

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <img src="/img/Shape_1.png"></img>

            <img src="/img/PP_Large.png"></img>

            <div className={styles.footerInfo}>
                <div className={styles.footerInfo1st}>
                    <p>Nguyễn Ngọc Minh Quân</p>
                    <a>Project Manager</a>

                    <div>
                        <span className="material-symbols-outlined">phone_in_talk</span>
                        <p>+0 1234 56789</p>    
                    </div>

                    <div>
                        <span className="material-symbols-outlined">globe</span>
                        <p>bookworm-paradise.vercel.app</p>
                    </div>

                    <div>
                        <span className="material-symbols-outlined">location_on</span>
                        <p>Some where on Earth</p>
                    </div>  
                </div>

                <div className={styles.footerInfo2nd}>
                    <span className="material-symbols-outlined">globe_book</span>
                    <p>Unemployment Benefits</p>
                    <a>Fuck you and fuck you too</a>

                    <div>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-youtube"></i>
                        <i className="fa-brands fa-x-twitter"></i>
                    </div>
                </div>
            </div>

            <img src="/img/Shape_2.png"></img>
        </footer>
    )
}

