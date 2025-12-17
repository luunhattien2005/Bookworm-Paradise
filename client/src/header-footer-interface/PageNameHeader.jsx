import styles from "./HeaderFooter.module.css"

export default function PageNameHeader({ pagename }) {

    const icons = {
        Home: ['Home page', <i className="material-symbols-outlined" style={{ fontSize: "36px"}}>home</i>],
        Admin: ['Admin dashbroad',''],
        Profile: ['Your profile', <i className="fa-regular fa-circle-user" style={{ fontSize: "30px"}}></i>],
        Product: ['Product info', <i className="fa-solid fa-book-open" style={{ fontSize: "30px"}}></i>],
        Cart: ['Shopping cart',''],
    }

    return(
        <div className={styles.pageNameGradient}>
            <div className={styles.nameContainer}>
                {icons[pagename][1]} {icons[pagename][0]}
            </div>
        </div>
    )
}

