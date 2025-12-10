import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./HeaderFooter.module.css"

export default function Catalogue() {
    const titles = [{id: 1, name: "Sách tiếng việt"},
                    {id: 2, name: "Danh mục tổng hợp 2"},
                    {id: 3, name: "Danh mục tổng hợp 3"},
                    {id: 4, name: "Danh mục tổng hợp 4"},
                    {id: 5, name: "Danh mục tổng hợp 5"},
                    {id: 6, name: "Danh mục tổng hợp 6"}]
    const listTitle = titles.map(title => <li key={title.id} onClick={() => {setSelectedTitle(title.name)}}>{title.name}</li>)
    const [selectedTitle, setSelectedTitle] = useState(titles[0].name)
    return(
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
    )
}