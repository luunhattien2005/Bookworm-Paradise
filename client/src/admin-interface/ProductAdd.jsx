import styles from "./Dashboard.module.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAdminCreateBook } from "../hooks/useBooks"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

export default function ProductAdd() {
    const navigate = useNavigate()
    
    // State chứa đầy đủ các field của Book Model
    const [product, setProduct] = useState({
        name: "", author: "", price: "", stockQuantity: "", category: "", description: "", imgURL: "",
        publisher: "", provider: "", translator: "", publicationYear: "",
        weight: "", size: "", page: "", type: "Bìa mềm"
    });

    const createBookMutation = useAdminCreateBook({
        onSuccess: () => { alert("Thêm sách thành công!"); navigate("/admin/dashboard"); },
        onError: (err) => alert("Lỗi: " + (err.response?.data?.message || err.message))
    });

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        if (!product.name || !product.price) return alert("Vui lòng nhập tên và giá sách!");
        createBookMutation.mutate(product);
    }

    return (
        <>
            <PageNameHeader pagename="Admin"/>

            <div className={styles.content}>
                <div className={styles.formHeader}>
                    <h2>Thêm sản phẩm mới</h2>
                    <div className={styles.formActions}>
                        <button className={styles.submitButton} onClick={handleSubmit} disabled={createBookMutation.isPending}>
                            {createBookMutation.isPending ? "Đang lưu..." : "Lưu sản phẩm"}
                        </button>
                    </div>
                </div>

                <div className={styles.productForm}>
                    {/* Cột trái: Ảnh */}
                    <div className={styles.imageUpload}>
                        <div className={styles.imagePlaceholder} style={{position: 'relative', overflow: 'hidden'}}>
                            {product.imgURL ? (
                                <img src={product.imgURL} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={(e) => e.target.src="https://dummyimage.com/600x800/000/fff"} />
                            ) : (
                                <><span>🖼️</span><p>Ảnh Preview</p></>
                            )}
                        </div>
                    </div>

                    {/* Cột phải: Form */}
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup} style={{gridColumn: "1 / -1"}}>
                            <label>Link hình ảnh (URL)</label>
                            <input name="imgURL" value={product.imgURL} onChange={handleChange} placeholder="https://..." />
                        </div>

                        <div className={styles.formGroup}><label>Tên sách (*)</label><input name="name" value={product.name} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Tác giả</label><input name="author" value={product.author} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Giá bán</label><input type="number" name="price" value={product.price} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Tồn kho</label><input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Thể loại (phẩy)</label><input name="category" value={product.category} onChange={handleChange} placeholder="Tiểu thuyết, Văn học..." /></div>
                        <div className={styles.formGroup}><label>Nhà Xuất Bản</label><input name="publisher" value={product.publisher} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Nhà Cung Cấp</label><input name="provider" value={product.provider} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Dịch Giả</label><input name="translator" value={product.translator} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Năm XB</label><input type="number" name="publicationYear" value={product.publicationYear} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Trọng lượng (gr)</label><input type="number" name="weight" value={product.weight} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Kích thước</label><input name="size" value={product.size} onChange={handleChange} placeholder="13 x 20 cm" /></div>
                        <div className={styles.formGroup}><label>Số trang</label><input type="number" name="page" value={product.page} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Hình thức</label>
                            <select name="type" value={product.type} onChange={handleChange} style={{padding: 10, width: '100%'}}>
                                <option value="Bìa mềm">Bìa mềm</option>
                                <option value="Bìa cứng">Bìa cứng</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả chi tiết</label>
                        <textarea name="description" rows="5" value={product.description} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </>
    )
}