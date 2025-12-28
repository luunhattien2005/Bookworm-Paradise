import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-interface/AuthContext"
import { useCart } from "../hooks/useCart"
import { useTags } from "../hooks/useBooks"
import styles from "./HeaderFooter.module.css"

export default function Header() {
    const { user } = useContext(AuthContext)

    const IsAdmin = (user?.role === "admin")

    const { data: tags = [] } = useTags()
    const [keyword, setKeyword] = useState("")
    const [searchPlaceholder, setSearchPlaceholder] = useState("Nhà giả kim")
    const [selectedTags, setSelectedTags] = useState([]);

    const toggleTag = (id) => {
        setSelectedTags(prev =>
            prev.includes(id)
            ? prev.filter(t => t !== id)
            : [...prev, id]
        );
    };

    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()

        const q = keyword.trim()
        const params = new URLSearchParams();

        if (q) params.set("q", q);
        if (selectedTags.length > 0) {
            params.set("tag", selectedTags.join(","));
        }

        navigate(`/search?${params.toString()}`);
        setSearchPlaceholder(keyword)

        setKeyword("");
        setSelectedTags([]);
    }

    const { data: cart } = useCart() 
    const cartCount = cart?.items?.length || 0

    const BASE_URL = import.meta.env.VITE_API_URL;
    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith('http')
            ? user.avatar
            : `${BASE_URL}/${user.avatar}?t=${user.updatedAt}`)
        : "/img/PP_Large.png";

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
                    <img src={avatarUrl} onError={(e) => e.target.src = "/img/PP_Large.png"}/>
                </button>
            </Link>
        );
    }

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
                        <p className={styles.filterTitle}>Lọc theo thể loại</p>

                        <div className={styles.tagGrid}>
                            {tags.map(tag => (
                                <label key={tag._id} className={styles.tagItem}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag._id)}
                                        onChange={() => toggleTag(tag._id)}
                                    />
                                    <span>{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>                    
                </div>

                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder={searchPlaceholder}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <button type="submit">
                        <i className="material-symbols-outlined" style={{fontSize: "35px"}}>search</i>
                    </button>
                </form>     
            </div>


            <div className={styles.icons}>
                {IsAdmin && (
                    <Link to="/admin/dashboard">
                        <i className="material-symbols-outlined" style={{fontSize: "36px"}}>supervisor_account</i>
                    </Link>
                )}

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

 