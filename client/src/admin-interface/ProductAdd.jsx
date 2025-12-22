import styles from "./Dashboard.module.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function ProductAdd() {
    const navigate = useNavigate()

    const [product, setProduct] = useState({
        id: "",
        name: "",
        isbn: "",
        author: "",
        publisher: "",
        price: "",
        stock: "",
        category: "",
        year: "",
        description: ""
    })

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // handle submit
    const handleSubmit = () => {
        if (!product.name || !product.isbn) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc")
            return
        }

        // generate simple ID
        const newProduct = {
            ...product,
            id: "SP" + Date.now()
        }

        // get existing products
        const existing = JSON.parse(localStorage.getItem("products")) || []

        // save
        localStorage.setItem(
            "products",
            JSON.stringify([...existing, newProduct])
        )

        // go back to dashboard
        navigate("/admin/dashboard")
    }

    return (
        <div className={styles.content}>
            <h2>Thêm sản phẩm</h2>

            <div className={styles.productFormContainer}>
                <div className={styles.formHeader}>
                    <div className={styles.formActions}>
                        <button
                            className={styles.submitButton}
                            onClick={handleSubmit}
                        >
                            THÊM
                        </button>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            QUAY VỀ
                        </button>
                    </div>
                </div>

                <div className={styles.productForm}>
                    <div className={styles.imageUpload}>
                        <div className={styles.imagePlaceholder}>
                            <span>📷</span>
                            <p>Tải ảnh lên</p>
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Tên sách</label>
                            <input
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Mã ISBN</label>
                            <input
                                name="isbn"
                                value={product.isbn}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tác giả</label>
                            <input
                                name="author"
                                value={product.author}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nhà xuất bản</label>
                            <input
                                name="publisher"
                                value={product.publisher}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giá tiền</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tồn kho</label>
                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Loại</label>
                            <input
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Năm xuất bản</label>
                            <input
                                name="year"
                                value={product.year}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={product.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}