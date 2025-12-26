import styles from "./Dashboard.module.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAdminCreateBook } from "../hooks/useBooks"

export default function ProductAdd() {
    const navigate = useNavigate()
    const createBookMutation = useAdminCreateBook({
        onSuccess: () => {
            alert("Thêm sách thành công!");
            navigate("/admin/dashboard");
        },
        onError: (err) => alert("Lỗi: " + err.message)
    });

    const [product, setProduct] = useState({
        title: "", author: "", price: "", stock: "",
        category: "", description: "", oldPrice: ""
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (!product.title || !product.price) return alert("Nhập tên và giá sách!");

        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("author", product.author);
        formData.append("price", product.price);
        formData.append("stock", product.stock);
        formData.append("category", product.category);
        formData.append("description", product.description);

        if (imageFile) formData.append("image", imageFile); // Key 'image' phải khớp backend upload.single('image')

        createBookMutation.mutate(formData);
    }

    return (
        <div className={styles.content}>
            <h2>Thêm sản phẩm mới</h2>
            <div className={styles.productFormContainer}>
                <div className={styles.formHeader}>
                    <div className={styles.formActions}>
                        <button className={styles.submitButton} onClick={handleSubmit} disabled={createBookMutation.isLoading}>
                            {createBookMutation.isLoading ? "ĐANG LƯU..." : "LƯU SÁCH"}
                        </button>
                        <button className={styles.backButton} onClick={() => navigate("/admin/dashboard")}>HỦY</button>
                    </div>
                </div>

                <div className={styles.productForm}>
                    <div className={styles.imageUpload}>
                        <div className={styles.imagePlaceholder}>
                            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                            {imageFile && <p>Đã chọn: {imageFile.name}</p>}
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Tên sách</label><input name="title" onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Tác giả</label><input name="author" onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Giá bán</label><input type="number" name="price" onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Tồn kho</label><input type="number" name="stock" onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Danh mục</label><input name="category" onChange={handleChange} /></div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea name="description" rows="4" onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
    )
}