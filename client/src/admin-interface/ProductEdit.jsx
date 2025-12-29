import styles from "./Dashboard.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
// Import hook lấy 1 sách và hook update
import { useBook, useAdminUpdateBook } from "../hooks/useBooks"
import Loading from "../header-footer-interface/Loading"

export default function ProductEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    // 1. Lấy dữ liệu sách từ API
    // (Lưu ý: Bạn cần chắc chắn trong useBooks.js có hook 'useBook' hoặc 'useGetBook'. 
    // Nếu trong useBooks.js tên là useBookById thì sửa dòng này lại cho khớp)
    const { data: bookData, isLoading, isError } = useBook(id); 

    // 2. Hook Update
    const updateBookMutation = useAdminUpdateBook(id, {
        onSuccess: () => {
            alert("Cập nhật sách thành công!");
            navigate("/admin/dashboard");
        },
        onError: (err) => alert("Lỗi: " + (err.response?.data?.message || err.message))
    });

    const [product, setProduct] = useState({
        name: "", author: "", price: "", stockQuantity: "", category: "", description: "", imgURL: "",
        publisher: "", provider: "", translator: "", publicationYear: "",
        weight: "", size: "", page: "", type: "Bìa mềm"
    });

    // 3. Khi có dữ liệu từ API -> Đổ vào State
    useEffect(() => {
        if (bookData) {
            setProduct({
                name: bookData.name || "",
                // Xử lý Author: Vì API trả về Object { _id, AuthorName }, ta chỉ lấy tên để hiện lên input
                author: bookData.author?.AuthorName || "",
                price: bookData.price || "",
                stockQuantity: bookData.stockQuantity || "",
                // Xử lý Tags: Chuyển mảng Object thành chuỗi "Tiểu thuyết, Văn học"
                category: bookData.tags?.map(t => t.name).join(", ") || "",
                description: bookData.description || "",
                imgURL: bookData.imgURL || "",
                
                // Các trường phụ
                publisher: bookData.publisher || "",
                provider: bookData.provider || "",
                translator: bookData.translator || "",
                publicationYear: bookData.publicationYear || "",
                weight: bookData.weight || "",
                size: bookData.size || "",
                page: bookData.page || "",
                type: bookData.type || "Bìa mềm"
            });
        }
    }, [bookData]);

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        updateBookMutation.mutate(product);
    }

    if (isLoading) return <Loading />;
    if (isError || !bookData) return <div style={{padding: 20}}>Không tìm thấy sách (ID: {id})</div>;

    return (
        <div className={styles.content}>
            <div className={styles.formHeader}>
                <h2>Chỉnh sửa sản phẩm: {product.name.substring(0, 30)}{(product.name?.length > 30)  && "..."}</h2>
                <div className={styles.formActions}>
                    <button className={styles.submitButton} onClick={handleSubmit} disabled={updateBookMutation.isPending}>
                        {updateBookMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button className={styles.submitButton} style={{background: "#ddd"}} onClick={() => navigate("/admin/dashboard")}>
                        Hủy
                    </button>
                </div>
            </div>

            <div className={styles.productForm}>
                <div className={styles.imageUpload}>
                    <div className={styles.imagePlaceholder} style={{position: 'relative', overflow: 'hidden'}}>
                        {product.imgURL ? (
                            <img src={product.imgURL} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={(e) => e.target.src="https://via.placeholder.com/200?text=Lỗi+Link"}/>
                        ) : (
                            <><span>🖼️</span><p>Ảnh Preview</p></>
                        )}
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup} style={{gridColumn: "1 / -1"}}>
                        <label>Link hình ảnh (URL)</label>
                        <input name="imgURL" value={product.imgURL} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}><label>Tên sách</label><input name="name" value={product.name} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Tác giả</label><input name="author" value={product.author} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Giá bán</label><input type="number" name="price" value={product.price} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Tồn kho</label><input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Thể loại</label><input name="category" value={product.category} onChange={handleChange} /></div>

                    <div className={styles.formGroup}><label>Nhà Xuất Bản</label><input name="publisher" value={product.publisher} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Nhà Cung Cấp</label><input name="provider" value={product.provider} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Dịch Giả</label><input name="translator" value={product.translator} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Năm XB</label><input type="number" name="publicationYear" value={product.publicationYear} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Trọng lượng</label><input type="number" name="weight" value={product.weight} onChange={handleChange} /></div>
                    <div className={styles.formGroup}><label>Kích thước</label><input name="size" value={product.size} onChange={handleChange} /></div>
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
    )
}