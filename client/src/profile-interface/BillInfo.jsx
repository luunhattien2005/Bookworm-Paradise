import styles from "./Profile.module.css"
import { href, useParams } from "react-router-dom"
// 👇 1. Import thêm useCancelOrder
import { useOrderById, useCancelOrder } from "../hooks/useOrder"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import Loading from "../header-footer-interface/Loading"

export default function BillInfo() {
    const { id } = useParams();
    const { data: order, isLoading, isError, error } = useOrderById(id);
    
    // 👇 2. Khai báo mutation hủy đơn
    const cancelOrderMutation = useCancelOrder();

    if (isLoading) return <Loading />;
    if (isError || !order) return <Loading error={true} message={error.message} />
    
    // 👇 3. Hàm xử lý khi bấm nút Hủy
    const handleCancel = () => {
        if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            cancelOrderMutation.mutate(id, {
                onSuccess: () => alert("Đã hủy đơn hàng thành công!"),
                onError: (err) => alert(err.response?.data?.message || "Lỗi khi hủy đơn")
            });
        }
    }

    return (
        <>
            <PageNameHeader pagename="Bill" />

            <div className={styles.billContainer}>
                <h1 className={styles.billTitle}>HÓA ĐƠN ĐIỆN TỬ</h1>

                {/* Order meta */}
                <div className={styles.billSection}>
                    <div><p><strong>Mã đơn:</strong> {order._id}</p></div>
                    <div><p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
                    <div>
                        <p>
                            <strong>Trạng thái:</strong>
                            {/* Class CSS tự động map theo tên trạng thái: pending, delivered... */}
                            <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Customer */}
                <div className={styles.billSection}>
                    <p className={styles.billSectionTitle}>Thông tin khách hàng</p>
                    <p><strong>Họ tên:</strong> {order.user?.fullname || "N/A"}</p>
                    <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                    <p><strong>SĐT:</strong> {order.user?.phone || "N/A"}</p>
                </div>

                {/* Items */}
                <div className={styles.billSection}>
                    <p className={styles.billSectionTitle}>Chi tiết đơn hàng</p>
                    <table className={styles.billTable}>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>SL</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.book?.name}</td>
                                    <td>{item.price?.toLocaleString("vi-VN")}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity).toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Shipping info */}
                <div className={styles.billSection}>
                    <p className={styles.billSectionTitle}>Thông tin giao hàng</p>
                    <p><strong>Địa chỉ nhận:</strong> {order.shippingAddress}</p>
                    <p><strong>Phương thức:</strong> {order.shippingMethod}</p>

                    {order.deliveryNote && (
                        <p><strong>Ghi chú:</strong> {order.deliveryNote}</p>
                    )}
                </div>

                {/* Total */}
                <div className={styles.billTotal}>
                    <div className={styles.totalRow}>
                        <span>Giá trị đơn hàng</span>
                        <span>{order.cartAmount?.toLocaleString("vi-VN")} VND</span>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Phí giao hàng</span>
                        <span>{order.shippingFee?.toLocaleString("vi-VN")} VND</span>
                    </div>

                    <div className={`${styles.totalRow} ${styles.final}`}>
                        <span>Tổng thanh toán</span>
                        <span>{order.totalAmount?.toLocaleString("vi-VN")} VND</span>
                    </div>
                </div>
            </div>
            
            {/* 👇 4. Nút hủy (Chỉ hiện khi trạng thái là Pending) */}
            {(order.status === "Pending") && (
                <div className={styles.billDeletedContainer}>
                    <button 
                        className="billDelete" 
                        onClick={handleCancel}
                        disabled={cancelOrderMutation.isPending}
                        style={{ cursor: "pointer" }}
                    > 
                        {cancelOrderMutation.isPending ? "Đang xử lý..." : "Hủy đơn hàng hiện tại"}
                    </button>
                </div>
            )}

            {/* Hiển thị thông báo nếu đơn đã hủy */}
            {(order.status === "Cancelled") && (
                <div className={styles.billDeletedContainer}>
                    <p style={{color: "#721c24", fontWeight: "bold", padding: "10px", background: "#f8d7da", borderRadius: "5px"}}>
                        ĐƠN HÀNG ĐÃ ĐƯỢC HỦY BỞI BẠN
                    </p>
                </div>
            )}

            {/* Nút liên hệ */}
            <a className={styles.billDeletedContainer}  href="https://www.facebook.com/quan.chu.86787#" style={{textDecoration: "none"}}>
                <button className="billHelp"> Liên hệ hỗ trợ </button>
            </a>
        </>
    )
}