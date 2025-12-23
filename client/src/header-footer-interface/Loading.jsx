import styles from "./HeaderFooter.module.css"

export default function Loading({ error = false, message = "Loading..." }) {
    return (<>
        <div className={styles.loading}>
            <img src={error ? "/img/error.png" : "/gif/loading.gif"} alt={error ? "Error img" : "Loading gif"} />
            <p>{message}</p>
        </div>
    </>);
}