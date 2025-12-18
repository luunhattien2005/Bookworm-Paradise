import DOMPurify from "dompurify"
import styles from "./Product.module.css"

export default function RatingItem({ rating }) {
  const date = new Date(rating.createdAt)

  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  const day = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.ratingProfile}>
        <img src={rating.user.img_url} />
        <p>{rating.user.username}</p>
        <p>{time}</p>
        <p>{day}</p>
      </div>

      <div className={styles.ratingContent}>
        <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(i => (
                <i
                key={i}
                className={
                    i <= rating.star
                    ? `fa-solid fa-star ${styles.starFilled}`
                    : `fa-regular fa-star ${styles.starEmpty}`
                }
                />
            ))}
        </div>

        <div className={styles.ratingHTML} dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(rating.content)
        }} />
      </div>
    </div>
  )
}
