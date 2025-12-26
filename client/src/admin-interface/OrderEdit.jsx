import styles from "./Dashboard.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useOrderById, useUpdateOrderStatus } from "../hooks/useOrder"
import Loading from "../header-footer-interface/Loading"

export default function OrderEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("")

    // 1. Lấy chi tiết đơn hàng
    const { data: order, isLoading } = useOrderById(id);

    // 2. Hook cập nhật
    const updateStatusMutation = useUpdateOrderStatus({
        onSuccess: () => {
            alert("Cập nhật trạng thái thành công!");
            navigate("/admin/dashboard");
        }
    });

    useEffect(() => {
        if (order) setStatus(order.status);
    }, [order]);

    if (isLoading) return <Loading />;
    if (!order) return <p>Không tìm thấy đơn hàng</p>;

    const handleUpdate = () => {
        updateStatusMutation.mutate({ orderId: id, status });
    }

    return (
        <div className={styles.content}>
            <h2>Chi tiết đơn hàng: {id}</h2>
            <div className={styles.orderEditContainer}>
                <div className={styles.orderDetails}>
                    <p><strong>Khách hàng:</strong> {order.user?.fullname}</p>
                    <p><strong>Địa chỉ:</strong> {order.address || order.user?.address}</p>
                    <p><strong>Tổng tiền:</strong> {Number(order.totalPrice).toLocaleString()} đ</p>
                </div>

                <div className={styles.statusSection}>
                    <h3>Cập nhật trạng thái:</h3>
                    <div className={styles.radioGroup}>
                        <label><input type="radio" checked={status === "pending"} onChange={() => setStatus("pending")} /> Chưa giao</label>
                        <label><input type="radio" checked={status === "processing"} onChange={() => setStatus("processing")} /> Đang giao</label>
                        <label><input type="radio" checked={status === "completed"} onChange={() => setStatus("completed")} /> Hoàn thành</label>
                    </div>
                </div>

                <button className={styles.updateButton} onClick={handleUpdate}>LƯU TRẠNG THÁI</button>
                <button className={styles.backButton} onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>QUAY LẠI</button>
            </div>
        </div>
    )
}
