import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"

export default function ProductEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState({
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

    // 🔹 Load product
    useEffect(() => {
        const products = JSON.parse(localStorage.getItem("products")) || []
        const found = products.find(p => p.id === id)

        if (!found) {
            alert("Product not found")
            navigate("/admin/products")
            return
        }

        setProduct(found)
    }, [id, navigate])

    // 🔹 Handle change
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    // 🔹 Update
    const handleUpdate = () => {
        const products = JSON.parse(localStorage.getItem("products")) || []

        const updated = products.map(p =>
            p.id === id ? product : p
        )

        localStorage.setItem("products", JSON.stringify(updated))
        alert("Updated successfully")
        navigate("/admin/products")
    }

    return (
        <div className={styles.content}>
            <h2>Cập nhật sản phẩm</h2>

            <div className={styles.productFormContainer}>
                <div className={styles.formHeader}>
                    <h2>Thông tin sản phẩm</h2>
                    <div className={styles.formActions}>
                        <button className={styles.updateButton} onClick={handleUpdate}>
                            CẬP NHẬT
                        </button>
                        <button className={styles.backButton} onClick={() => navigate(-1)}>
                            QUAY VỀ
                        </button>
                    </div>
                </div>

                <div className={styles.productForm}>
                    <div className={styles.formGrid}>
                        <Input label="Tên sách" name="name" value={product.name} onChange={handleChange} />
                        <Input label="Mã ISBN" name="isbn" value={product.isbn} onChange={handleChange} />
                        <Input label="Tác giả" name="author" value={product.author} onChange={handleChange} />
                        <Input label="Nhà xuất bản" name="publisher" value={product.publisher} onChange={handleChange} />
                        <Input label="Giá tiền" name="price" type="number" value={product.price} onChange={handleChange} />
                        <Input label="Tồn kho" name="stock" type="number" value={product.stock} onChange={handleChange} />
                        <Input label="Loại" name="category" value={product.category} onChange={handleChange} />
                        <Input label="Năm xuất bản" name="year" value={product.year} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// 🔹 Small reusable input component
function Input({ label, name, value, onChange, type = "text" }) {
    return (
        <div className={styles.formGroup}>
            <label>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
