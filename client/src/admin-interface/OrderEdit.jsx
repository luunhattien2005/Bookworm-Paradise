import styles from "./Dashboard.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function OrderEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [status, setStatus] = useState("pending")

    // Load order by ID
    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem("orders")) || []

        // IMPORTANT: id from params is STRING
        const found = orders.find(o => String(o.id) === String(id))

        if (!found) {
            alert("Order not found")
            navigate("/admin/dashboard")
            return
        }

        setOrder(found)
        setStatus(found.status || "pending")
    }, [id, navigate])

    // Update status only
    const handleUpdate = () => {
        const orders = JSON.parse(localStorage.getItem("orders")) || []

        const updatedOrders = orders.map(o =>
            String(o.id) === String(id)
                ? { ...o, status }
                : o
        )

        localStorage.setItem("orders", JSON.stringify(updatedOrders))
        alert("Cập nhật trạng thái thành công")
        navigate("/admin/dashboard")
    }

    if (!order) return null

    return (
        <div className={styles.content}>
            <h2>Cập nhật đơn hàng</h2>

            <div className={styles.orderEditContainer}>
                <div className={styles.orderEditHeader}>
                    <div className={styles.orderActions}>
                        <button
                            className={styles.updateButton}
                            onClick={handleUpdate}
                        >
                            CẬP NHẬT
                        </button>

                        <button
                            className={styles.backButton}
                            onClick={() => navigate(-1)}
                        >
                            QUAY VỀ
                        </button>
                    </div>
                </div>

                <div className={styles.orderDetails}>
                    <div className={styles.orderInfo}>
                        <p><strong>Mã đơn:</strong> {order.id}</p>
                        <p><strong>Ngày giao:</strong> {order.date}</p>
                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                    </div>

                    <div className={styles.orderInfo}>
                        <p><strong>Mã khách hàng:</strong> {order.customerId}</p>
                        <p><strong>Tổng tiền:</strong> {order.total}</p>
                    </div>
                </div>

                <div className={styles.paymentMethod}>
                    <h3>Phương thức:</h3>
                    <p>{order.payment}</p>
                </div>

                <div className={styles.statusSection}>
                    <h3>Trạng thái:</h3>

                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                value="pending"
                                checked={status === "pending"}
                                onChange={() => setStatus("pending")}
                            />
                            <span>Chưa giao</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="processing"
                                checked={status === "processing"}
                                onChange={() => setStatus("processing")}
                            />
                            <span>Đang giao</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="completed"
                                checked={status === "completed"}
                                onChange={() => setStatus("completed")}
                            />
                            <span>Đã giao</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
