import { useSearchParams } from "react-router-dom";
import { useSearchBooks } from "../hooks/useBooks";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../header-footer-interface/Loading";
import styles from "./Search.module.css";

export default function SearchResult() {
    const [params] = useSearchParams()
    const q = params.get("q")

    const { data: books = [], isLoading } = useSearchBooks(q)
    const [selectedTags, setSelectedTags] = useState([]);

    const tags = Array.from(
        new Map(
            books.flatMap(book => book.tags || []).map(tag => [tag._id, tag])
        ).values()
    )

    const toggleTag = (id) => {
        setSelectedTags(prev =>
            prev.includes(id)
            ? prev.filter(t => t !== id)
            : [...prev, id]
        );
    };

    const filteredBooks = books.filter(book =>
        selectedTags.length === 0 ||
        selectedTags.every(tagId =>
            book.tags?.some(t => t._id === tagId)
        )
    );


    if (isLoading) return <Loading />
    return (
    <div className={styles.container}>

        {/* FILTER */}
        <aside className={styles.filter}>
        <h4>Thể loại</h4>

        {tags.length === 0 && <p>Không có thể loại</p>}

        {tags.map(tag => (
            <label key={tag._id} className={styles.filterItem}>
            <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => toggleTag(tag._id)}
            />
            {tag.name}
            </label>
        ))}
        </aside>

        {/* RESULT */}
        <section className={styles.grid}>
        {filteredBooks.length === 0 && (
            <p>Không tìm thấy sách phù hợp</p>
        )}

        {filteredBooks.map(book => (
            <div className={styles.card} key={book._id}>
            <img src={book.imgURL} alt={book.name} />
            
            <Link to={`/product/${book.slug}`}><h5>{book.name}</h5></Link>
            <p>{book.author?.AuthorName}</p>
            <span>{book.price.toLocaleString("vi-VN")} VND</span>
            </div>
        ))}
        </section>

    </div>
    );
}
