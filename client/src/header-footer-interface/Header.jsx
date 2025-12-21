import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../auth-interface/AuthContext"
import { useCart } from "./hooks/useCart"

import styles from "./HeaderFooter.module.css"

export default function Header() {
    const { user } = useContext(AuthContext)
    const { data: cart } = useCart()
    const cartCount = cart?.items?.length || 0

    let profileIcon;
    if (!user) {
        profileIcon = (
            <Link to="/profile/info">
                <i className="material-symbols-outlined" style={{fontSize: "33px"}}>
                    account_circle
                </i>
            </Link>
        );
    } else {
        profileIcon = (
            <Link to="/profile/info">
                <button type="button">
                    <img src={user.avatar} />
                </button>
            </Link>
        );
    }
    
    const titles = [{id: 1, name: "Sách tiếng việt"},
                    {id: 2, name: "Danh mục tổng hợp 2"},
                    {id: 3, name: "Danh mục tổng hợp 3"},
                    {id: 4, name: "Danh mục tổng hợp 4"},
                    {id: 5, name: "Danh mục tổng hợp 5"},
                    {id: 6, name: "Danh mục tổng hợp 6"},]

    const listTitle = titles.map(title => <li key={title.id} onClick={() => {setSelectedTitle(title.name)}}>{title.name}</li>)
    const [selectedTitle, setSelectedTitle] = useState(titles[0].name)

    return(
        <header className={styles.siteHeader}>
            <Link to={"/home"} className={styles.brand}>
                Bookworm<br/>Paradise
            </Link>
            
            <div className={styles.menuSearchContainer}>
                <div className={styles.catalogueDropdown}>
                    <button type="button">
                        <i className="material-symbols-outlined" style={{fontSize: "40px"}}>menu</i>
                     </button>

                    <div className={styles.catalogueContainer}>
                        <div className={styles.catalogueTitleContainer}>
                            <p>Danh mục sản phẩm</p>
                            <hr/>
                            <ul>{listTitle}</ul>
                        </div>

                        <div className={styles.catalogueItemContainer}>
                            {selectedTitle}
                        </div>
                    </div>                    
                </div>

                <form className={styles.searchBar}>
                    <input type="text" placeholder="Nhà giả kim"></input>

                    <button type="submit">
                        <i className="material-symbols-outlined" style={{fontSize: "35px"}}>search</i>
                    </button>
                </form>     
            </div>


            <div className={styles.icons}>
                <Link to="/profile/notifications">
                    <i className="fa-regular fa-bell" style={{fontSize: "30px"}}></i>
                </Link>

                <Link to="/cart" className={styles.cartIcon}>
                    <i className="material-symbols-outlined" style={{fontSize: "35px"}}>shopping_cart</i>
                    {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                </Link>

                <Link to="/profile/favorites">
                    <i className="fa-regular fa-heart" style={{fontSize: "30px"}}></i>
                </Link>

                <Link to="/gifts">
                    <i className="material-symbols-outlined" style={{fontSize: "31px"}}>featured_seasonal_and_gifts</i>
                </Link>

                {profileIcon}
            </div>
        </header>
    )
}

 