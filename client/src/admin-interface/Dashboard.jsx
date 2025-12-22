
import styles from "./Dashboard.module.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("products")
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [accounts, setAccounts] = useState([])
    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || []

        // default products (only first time)
        if (storedProducts.length === 0) {
            const defaultProducts = [
                { id: "SP123456", name: "Kỹ thuật lập trình", isbn: "2235", price: "79000", stock: 65 },
                { id: "SP456789", name: "Tư tưởng Hồ Chí Minh", isbn: "3364", price: "49000", stock: 120 },
                { id: "SP789654", name: "Nguyên lý kế toán", isbn: "4455", price: "55000", stock: 90 },
                { id: "SP321654", name: "Nền tảng AI", isbn: "6678", price: "89000", stock: 45 },
            ]

            localStorage.setItem("products", JSON.stringify(defaultProducts))
            setProducts(defaultProducts)
        } else {
            setProducts(storedProducts)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders))
    }, [])

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || []

        if (storedOrders.length === 0) {
            const defaultOrders = [
                {
                    id: "HD00001",
                    customer: "Lê Thanh",
                    customerId: "CS00001",
                    date: "11-12-2025",
                    address: "227 Nguyễn Văn Cừ, Q5",
                    total: "169000",
                    payment: "Tiền mặt",
                    status: "processing"
                },
                {
                    id: "HD00002",
                    customer: "Nguyễn Văn A",
                    customerId: "CS00002",
                    date: "10-12-2025",
                    address: "Q1, TP.HCM",
                    total: "250000",
                    payment: "Chuyển khoản",
                    status: "pending"
                }
            ]

            localStorage.setItem("orders", JSON.stringify(defaultOrders))
            setOrders(defaultOrders)
        } else {
            setOrders(storedOrders)
        }
    }, [])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("accounts")) || []

        if (stored.length === 0) {
            const defaultAccounts = [
                { id: "US00001", name: "Nguyễn Văn Anh", role: "Admin", email: "nvanh@gmail.com", status: "active" },
                { id: "US00002", name: "Khánh Huy Hồng", role: "Customer", email: "khhong@gmail.com", status: "active" },
                { id: "US00003", name: "Lê Văn Long", role: "Customer", email: "lvlong@gmail.com", status: "banned" },
            ]
            localStorage.setItem("accounts", JSON.stringify(defaultAccounts))
            setAccounts(defaultAccounts)
        } else {
            setAccounts(stored)
        }
    }, [])

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>Bookworm Paradise</div>
                <button className={styles.logout}>LOGOUT</button>
            </header>

            {/* Admin Interface Banner */}
            <div className={styles.adminInterface}>Admin Interface</div>

            {/* Navigation */}
            <nav className={styles.nav}>
                <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? styles.active : ""}>
                    PRODUCTS
                </button>
                <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? styles.active : ""}>
                    ORDER
                </button>
                <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? styles.active : ""}>
                    ACCOUNT
                </button>
                <button onClick={() => setActiveTab("analytics")} className={activeTab === "analytics" ? styles.active : ""}>
                    ANALYTICS
                </button>
            </nav>

            {/* Content */}
            <main className={styles.content}>
                {/* Products Tab */}
                {activeTab === "products" && (
                    <>
                        <div className={styles.searchBar}>
                            <input type="text" placeholder="Nhập mã sản phẩm" className={styles.search} />
                            <button className={styles.searchButton}>🔍</button>
                            <button
                                className={styles.addButton}
                                onClick={() => navigate("/admin/products/add")}
                            >
                                ADD NEW PRODUCT
                            </button>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sách</th>
                                    <th>ISBN</th>
                                    <th>Giá tiền</th>
                                    <th>Tồn kho</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.isbn}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button
                                                className={styles.editIcon}
                                                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className={styles.deleteIcon}
                                                onClick={() => {
                                                    if (confirm(`Delete product ${product.name}?`)) {
                                                        const updated = products.filter(p => p.id !== product.id)
                                                        setProducts(updated)
                                                        localStorage.setItem("products", JSON.stringify(updated))
                                                    }
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Tìm theo tên"
                                className={styles.search}
                            />
                            <button className={styles.searchButton}>🔍</button>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày giao</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td>{order.total}</td>

                                        {/* ✅ STATUS COLUMN */}
                                        <td>
                                            <span
                                                className={
                                                    order.status === "completed"
                                                        ? styles.completed
                                                        : order.status === "processing"
                                                            ? styles.processing
                                                            : styles.pending
                                                }
                                            >
                                                {order.status === "completed"
                                                    ? "Đã giao"
                                                    : order.status === "processing"
                                                        ? "Đang giao"
                                                        : "Chưa giao"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className={styles.editIcon}
                                                onClick={() =>
                                                    navigate(`/admin/orders/${order.id}/edit`)
                                                }
                                            >
                                                ✏️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                    <>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Tìm theo tên"
                                className={styles.search}
                            />
                            <button className={styles.searchButton}>🔍</button>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và tên</th>
                                    <th>Vai trò</th>
                                    <th>Email</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {accounts.map(account => (
                                    <tr key={account.id}>
                                        <td>{account.id}</td>
                                        <td>{account.name}</td>
                                        <td>{account.role}</td>
                                        <td>{account.email}</td>
                                        <td>
                                            <span
                                                className={
                                                    account.status === "active"
                                                        ? styles.activeStatus
                                                        : styles.bannedStatus
                                                }
                                            >
                                                {account.status === "active" ? "Hoạt động" : "Bị khóa"}
                                            </span>
                                        </td>

                                        <td>
                                            {account.role !== "Admin" && (
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => {
                                                        const updated = accounts.map(acc =>
                                                            acc.id === account.id
                                                                ? {
                                                                    ...acc,
                                                                    status: acc.status === "active" ? "banned" : "active"
                                                                }
                                                                : acc
                                                        )

                                                        setAccounts(updated)
                                                        localStorage.setItem("accounts", JSON.stringify(updated))
                                                    }}
                                                >
                                                    {account.status === "active" ? "BAN" : "UNBAN"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <div className={styles.analyticsGrid}>
                        <div className={styles.metricCard}>
                            <h3>DOANH THU</h3>
                            <p className={styles.metricValue}>10000000</p>
                        </div>
                        <div className={styles.metricCard}>
                            <h3>SỐ LƯỢNG SÁCH BÁN</h3>
                            <p className={styles.metricValue}>453</p>
                        </div>
                        <div className={styles.metricCard}>
                            <h3>SỐ LƯỢNG ĐƠN HÀNG</h3>
                            <p className={styles.metricValue}>298</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
