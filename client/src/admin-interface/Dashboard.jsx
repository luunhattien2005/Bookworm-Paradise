import styles from "./Dashboard.module.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchBooks, useAdminDeleteBook } from "../hooks/useBooks" // Hook Sách
import { useAllAccounts, useBanAccount } from "../hooks/useAuth"       // Hook Tài khoản
import { useAllOrders } from "../hooks/useOrder"                       // Hook Đơn hàng
import Loading from "../header-footer-interface/Loading"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("products")
    const navigate = useNavigate()

    // --- 1. DATA PRODUCTS ---
    // q="" để lấy tất cả sách. Backend trả về { docs: [...] } hoặc [...] tùy API
    const { data: booksData, isLoading: loadingBooks } = useSearchBooks("", { limit: 1000 });
    const products = booksData?.docs || booksData || [];
    const deleteBookMutation = useAdminDeleteBook();

    // --- 2. DATA ACCOUNTS ---
    const { data: accounts, isLoading: loadingAccounts } = useAllAccounts();
    const banAccountMutation = useBanAccount();

    // --- 3. DATA ORDERS ---
    const { data: orders, isLoading: loadingOrders } = useAllOrders();

    // --- 4. ANALYTICS (Tính toán từ data thật) ---
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const totalBooks = products?.length || 0;

    // Loading chung
    if (loadingBooks || loadingAccounts || loadingOrders) return <Loading />;

    return (
        <>
            <PageNameHeader pagename="Admin"/>  

            <div className={styles.container}>
                <nav className={styles.nav}>
                    <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? styles.active : ""}>PRODUCTS</button>
                    <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? styles.active : ""}>ORDER</button>
                    <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? styles.active : ""}>ACCOUNT</button>
                    <button onClick={() => setActiveTab("analytics")} className={activeTab === "analytics" ? styles.active : ""}>ANALYTICS</button>
                </nav>

                <button className={styles.logout} onClick={() => navigate("/logout")}>LOGOUT</button>

                <main className={styles.content}>

                    {/* ---------------- PRODUCTS TAB ---------------- */}
                    {activeTab === "products" && (
                        <>
                            <div className={styles.searchBar}>
                                <input type="text" placeholder="Tìm kiếm sách..." className={styles.search} />
                                <button className={styles.searchButton}>🔍</button>
                                <button className={styles.addButton} onClick={() => navigate("/admin/products/add")}>
                                    ADD NEW PRODUCT
                                </button>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Ảnh</th>
                                        <th>Tên sách</th>
                                        <th>Giá tiền</th>
                                        <th>Tồn kho</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <img
                                                    src={product.image ? `http://localhost:5000/${product.image}` : "https://via.placeholder.com/50"}
                                                    alt=""
                                                    style={{ width: "40px", height: "60px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{product.title}</td>
                                            <td>{Number(product.price).toLocaleString()} đ</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <button className={styles.editIcon} onClick={() => navigate(`/admin/products/${product._id}/edit`)}>✏️</button>
                                                <button className={styles.deleteIcon} onClick={() => {
                                                    if (confirm(`Xóa sách "${product.title}"?`)) {
                                                        deleteBookMutation.mutate(product._id);
                                                    }
                                                }}>❌</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* ---------------- ORDERS TAB ---------------- */}
                    {activeTab === "orders" && (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Khách hàng</th>
                                        <th>Ngày đặt</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}...</td>
                                            <td>{order.user?.fullname || "Khách vãng lai"}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{Number(order.totalPrice).toLocaleString()} đ</td>
                                            <td>
                                                <span className={
                                                    order.status === "completed" ? styles.completed :
                                                        order.status === "processing" ? styles.processing : styles.pending
                                                }>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className={styles.editIcon} onClick={() => navigate(`/admin/orders/${order._id}/edit`)}>✏️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* ---------------- ACCOUNTS TAB ---------------- */}
                    {activeTab === "account" && (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Họ tên</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts?.map(acc => (
                                        <tr key={acc._id}>
                                            <td>{acc.fullname}</td>
                                            <td>{acc.email}</td>
                                            <td>{acc.role}</td>
                                            <td>
                                                <span className={!acc.isBanned ? styles.activeStatus : styles.bannedStatus}>
                                                    {!acc.isBanned ? "Hoạt động" : "Bị khóa"}
                                                </span>
                                            </td>
                                            <td>
                                                {acc.role !== "admin" && (
                                                    <button
                                                        className={styles.actionButton}
                                                        style={{ backgroundColor: acc.isBanned ? "#4CAF50" : "#ff4444", color: "white" }}
                                                        onClick={() => {
                                                            if (confirm(acc.isBanned ? "Mở khóa user này?" : "Khóa user này?")) {
                                                                banAccountMutation.mutate(acc._id);
                                                            }
                                                        }}
                                                    >
                                                        {acc.isBanned ? "UNBAN" : "BAN"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* ---------------- ANALYTICS TAB ---------------- */}
                    {activeTab === "analytics" && (
                        <div className={styles.analyticsGrid}>
                            <div className={styles.metricCard}>
                                <h3>DOANH THU TỔNG</h3>
                                <p className={styles.metricValue}>{totalRevenue.toLocaleString()} đ</p>
                            </div>
                            <div className={styles.metricCard}>
                                <h3>SỐ ĐẦU SÁCH</h3>
                                <p className={styles.metricValue}>{totalBooks}</p>
                            </div>
                            <div className={styles.metricCard}>
                                <h3>TỔNG ĐƠN HÀNG</h3>
                                <p className={styles.metricValue}>{totalOrders}</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}
