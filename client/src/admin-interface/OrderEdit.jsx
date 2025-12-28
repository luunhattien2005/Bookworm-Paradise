import styles from "./Dashboard.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useOrderById, useUpdateOrderStatus } from "../hooks/useOrder"
import Loading from "../header-footer-interface/Loading"

export default function OrderEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("")

    const { data: order, isLoading } = useOrderById(id);

    const updateStatusMutation = useUpdateOrderStatus({
        onSuccess: () => {
            alert("Cập nhật trạng thái thành công!");
            navigate("/admin/dashboard");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Lỗi cập nhật");
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

    // Kiểm tra xem đơn đã giao chưa để khóa giao diện
    const isLocked = order.status === "Delivered" || order.status === "Cancelled";

    return (
        <div className={styles.content}>
            <h2>Chi tiết đơn hàng: {id}</h2>
            <div className={styles.orderEditContainer}>
                <div className={styles.orderDetails}>
                    <p><strong>Khách hàng:</strong> {order.user?.fullname}</p>
                    <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
                    <p><strong>Tổng tiền:</strong> {Number(order.totalAmount).toLocaleString()} đ</p>
                </div>

                <div className={styles.statusSection}>
                    <h3>Cập nhật trạng thái:</h3>
                    
                    {isLocked && <p style={{color: "red", fontStyle: "italic"}}>* Đơn hàng đã giao thành công, không thể thay đổi trạng thái.</p>}

                    <div className={styles.radioGroup}>
                        
                        <label>
                            <input 
                                type="radio" 
                                checked={status === "Pending"} 
                                onChange={() => setStatus("Pending")} 
                                disabled={isLocked} // Khóa nếu đã Delivered
                            /> 
                            Pending (Chờ xử lý)
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                checked={status === "Processing"} 
                                onChange={() => setStatus("Processing")} 
                                disabled={isLocked}
                            /> 
                            Processing (Đang đóng gói)
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                checked={status === "Shipping"} 
                                onChange={() => setStatus("Shipping")} 
                                disabled={isLocked}
                            /> 
                            Shipping (Đang giao)
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                checked={status === "Delivered"} 
                                onChange={() => setStatus("Delivered")} 
                                disabled={isLocked}
                            /> 
                            Delivered (Đã giao)
                        </label>

                    </div>
                </div>

                {!isLocked && (
                    <button className={styles.updateButton} onClick={handleUpdate}>
                        LƯU TRẠNG THÁI
                    </button>
                )}
                
                <button className={styles.backButton} onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
                    QUAY LẠI
                </button>
            </div>
        </div>
    )
}