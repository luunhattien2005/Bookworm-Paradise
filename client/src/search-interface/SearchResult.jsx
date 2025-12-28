import { useSearchParams } from "react-router-dom";
import { useSearchBooks } from "../hooks/useBooks";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../header-footer-interface/Loading";
import PageNameHeader from "../header-footer-interface/PageNameHeader";
import styles from "./Search.module.css";

export default function SearchResult() {
    const [params, setParams] = useSearchParams()
    const [open, setOpen] = useState({
        price: true,
        tag: true,
        author: true
    })

    const q = params.get("q") || ""
    const selectedTags = params.get("tag")?.split(",") || []
    const selectedAuthors = params.get("author")?.split(",") || []
    
    const [priceRange, setPriceRange] = useState({
        min: params.get("min") || 0,
        max: params.get("max") || 1000000
    });

    const { data: books = [], isLoading } = useSearchBooks(q, {
        tag: params.get("tag"),
        author: params.get("author"),
        min: params.get("min"),
        max: params.get("max"),
    });

    const tags = Array.from(
        new Map(
            books.flatMap(book => book.tags || []).map(tag => [tag._id, tag])
        ).values()
    );

    const authors = Array.from(
        new Map(
            books.flatMap(book => book.author).filter(Boolean).map(author => [author._id, author])
        ).values()
    )

    const toggleMultiParam = (key, id) => {
        const newParams = new URLSearchParams(params)
        const current = newParams.get(key)?.split(",") || []

        const next = current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id]

        if (next.length === 0) newParams.delete(key)
        else newParams.set(key, next.join(","))

        setParams(newParams)
    }

    const applyPrice = () => {
        const newParams = new URLSearchParams(params)

        newParams.set("min", priceRange.min)
        newParams.set("max", priceRange.max)

        setParams(newParams)
    }

    if (isLoading) return <Loading />

    return (
        <>
        
            <PageNameHeader pagename="Search"/>
            <div className={styles.center}>
                <div className={styles.container}>

                    {/* FILTER */}
                    <aside className={styles.filter}>

                        {/* PRICES */}
                        <button
                            className={styles.filterHeader}
                            onClick={() => setOpen(o => ({ ...o, price: !o.price }))}
                        >
                            Giá tiền
                            <span className={open.price ? styles.rotate : ""}>▾</span>
                        </button>

                        {open.price && (
                            <div className={styles.priceBox}>
                                <input
                                    type="range"
                                    min={0}
                                    max={1000000}
                                    step={50000}
                                    value={priceRange.min}
                                    onChange={e => setPriceRange(p => ({ ...p, min: +e.target.value }))}
                                />

                                <input
                                    type="range"
                                    min={0}
                                    max={1000000}
                                    step={50000}
                                    value={priceRange.max}
                                    onChange={e => setPriceRange(p => ({ ...p, max: +e.target.value }))}
                                />

                                <div className={styles.priceValue}>
                                    {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()} VND
                                </div>

                                <button onClick={applyPrice} className={styles.gradientButton}>
                                    Áp dụng
                                </button>
                            </div>
                        )}


                        {/* TAGS */}
                        <button
                            className={styles.filterHeader}
                            onClick={() => setOpen(o => ({ ...o, tag: !o.tag }))}
                        >
                            Thể loại
                            <span className={open.tag ? styles.rotate : ""}>▾</span>
                        </button>

                        {tags.length === 0 && <p style={{ color: "red" }}>Không tìm thấy thể loại</p>}

                        {open.tag && tags.map(tag => (
                            <label key={tag._id} className={styles.filterItem}>
                            <input
                                type="checkbox"
                                checked={selectedTags.includes(tag._id)}
                                onChange={() => toggleMultiParam("tag", tag._id)}
                            />
                            {tag.name}
                            </label>
                        ))}

                        {/* AUTHOR */}
                        <button
                            className={styles.filterHeader}
                            onClick={() => setOpen(o => ({ ...o, author: !o.author }))}
                        >
                            Tác giả
                            <span className={open.author ? styles.rotate : ""}>▾</span>
                        </button>

                        {authors.length === 0 && <p style={{ color: "red" }}>Không tìm thấy tác giả</p>}

                        {open.author && authors.map(author => (
                            <label key={author._id} className={styles.filterItem}>
                                <input
                                type="checkbox"
                                checked={selectedAuthors.includes(author._id)}
                                onChange={() => toggleMultiParam("author", author._id)}
                                />
                                {author.AuthorName}
                            </label>
                        ))}
                    </aside>

                    {/* RESULT */}
                    <section className={styles.gridWrapper}>
                        {books.length === 0 ? (
                            <div className={styles.emptyState}>
                                <strong>Không tìm thấy sách phù hợp</strong>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                            {books.map(book => (
                                <Link
                                    key={book._id}
                                    to={`/product/${book.slug}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className={styles.card}>
                                        <img src={book.imgURL} alt={book.name} />
                                        <p><strong>{book.name}</strong></p>
                                        <p>{book.author?.AuthorName}</p>
                                        <span>{book.price?.toLocaleString("vi-VN")} VND</span>
                                    </div>
                                </Link>
                            ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
