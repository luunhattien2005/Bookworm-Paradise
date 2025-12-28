import styles from "./HeaderFooter.module.css"

export default function PageNameHeader({ pagename }) {

    const icons = {
        Home: ['Home page', <i className="material-symbols-outlined" style={{ fontSize: "36px"}}>home</i>],
        Admin: ['Admin dashbroad',<i className="material-symbols-outlined" style={{ fontSize: "32px"}}> dashboard </i>],
        Profile: ['Your profile', <i className="fa-regular fa-circle-user" style={{ fontSize: "30px"}}></i>],
        Product: ['Product info', <i className="fa-solid fa-book-open" style={{ fontSize: "30px"}}></i>],
        Cart: ['Shopping cart', <i className="material-symbols-outlined" style={{fontSize: "35px"}}>shopping_cart</i>],
        Checkout: ['Checkout', <i className="fa-solid fa-credit-card" style={{ fontSize: "30px"}}></i>],
        Bill: ['Bill Info', <i className="fa-solid fa-file" style={{ fontSize: "30px" }}></i>],
        Error: ['Messages', <i className="fa-regular fa-circle-user" style={{ fontSize: "30px"}}></i>],
        Search: ['Search result', <i className="material-symbols-outlined" style={{fontSize: "35px"}}>search</i>],
    }

    return(
        <div className={styles.pageNameGradient}>
            <div className={styles.nameContainer}>
                {icons[pagename][1]} {icons[pagename][0]}
            </div>
        </div>
    )
}

