import styles from "./Home.module.css"

export default function PopularBook() {
    return(
        <>
            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>
                    Nổi bật
                </div>
                <div className={styles.displayContent}>

                </div>
            </div>
        </>
    )
}

export default function WeeklyRating() {
    return(
        <>
            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>
                    Xếp hạng hàng tuần 
                </div>
                <div className={styles.displayContent}>

                </div>
            </div>
        </>
    )
}

export default function SeasonalBook() {
    return(
        <>
            <div className={styles.displayContainer}>
                <div className={styles.displayTitle}>
                    Bộ sưu tập theo mùa 
                </div>
                <div className={styles.displayContent}>

                </div>
            </div>
        </>
    )
}