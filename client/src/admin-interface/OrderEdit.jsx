import styles from "./Dashboard.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useOrderById, useUpdateOrderStatus } from "../hooks/useOrder"
import Loading from "../header-footer-interface/Loading"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import { useDialog } from "../header-footer-interface/DialogContext";

export default function OrderEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("")

    const { data: order, isLoading } = useOrderById(id);

    // Dialog set up
    const { showDialog } = useDialog();

    const updateStatusMutation = useUpdateOrderStatus({
        onSuccess: () => {
            showDialog("Cập nhật trạng thái thành công!");
            navigate("/admin/dashboard");
        },
        onError: (err) => {
            showDialog(err.response?.data?.message || "Lỗi cập nhật");
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
        <>
            <PageNameHeader pagename="Admin"/>

            <div className={styles.content}>
                <div className={styles.OrderTitle}>
                    <h1> Cập nhật thông tin đơn hàng</h1>

                    <div className={styles.OrderTitleRight}>
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



                <div className={styles.OrderEditBottom}>
                    
                    <div className={styles.OrderInfoEdit}>
                        <div style={{display: "flex"}}>
                            <h> Chi tiết đơn hàng: </h>
                            <p> {id} </p>
                        </div>

                        <div style={{display: "flex"}}>
                            <h1> Khách hàng: </h1>
                            <p1> {order.user?.fullname} </p1>
                        </div>
                    </div>


                    <div className={styles.OrderInfoEdit}>
                        <div style={{display: "flex"}}>
                            <h> Ngày giao: </h>
                            <p> {new Date(order.createdAt).toLocaleDateString("vi-VN")} </p>
                        </div>

                        <div style={{display: "flex"}}>
                            <h1> Tổng số tiền: </h1>
                            <p1> {Number(order.totalAmount).toLocaleString()} VND </p1>
                        </div>
                    </div>
                    
                    <div className={styles.OrderInfoEdit}>
                        <div style={{display: "flex"}}>
                            <h> Địa chỉ: </h>
                            <p> {order.shippingAddress} </p>
                        </div>
                    </div>

                    <div className={styles.OrderInfoEdit}>
                        <div style={{display: "flex"}}>
                            <h> Phương thức: </h>
                            <p> {order.paymentMethod} </p>
                        </div>

                        <div style={{display: "flex"}}>
                            <h1> Trạng thái: </h1>
                            <p1> {order.status} </p1>
                        </div>
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
                    
                </div>
            </div>
        </>
    )
}