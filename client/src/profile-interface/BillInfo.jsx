import styles from "./Profile.module.css"
import { useParams } from "react-router-dom"
import { useOrderById } from "../hooks/useOrder"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import Loading from "../header-footer-interface/Loading"

export default function BillInfo() {
    const { id } = useParams();
    const { data: order, isLoading, isError, error } = useOrderById(id);

    if (isLoading) return <Loading />;
    if (isError || !order) return <Loading error={true} message={error.message} />
    
    return (
        <>
            <PageNameHeader pagename="Bill" />

            <div className={styles.billContainer}>
                <h1 className={styles.billTitle}>HÓA ĐƠN ĐIỆN TỬ</h1>

                {/* Order meta */}
                <div className={styles.billSection}>
                    <div><p><strong>Mã đơn:</strong> {order._id}</p></div>
                    <div><p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
                    <div
                        ><p>
                            <strong>Trạng thái:</strong>
                            <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Customer */}
                <div className={styles.billSection}>
                    <h2>Thông tin khách hàng</h2><br/>
                    <p><strong>Họ tên:</strong> {order.user.fullname}</p>
                    <p><strong>Email:</strong> {order.user.email}</p>
                    <p><strong>SĐT:</strong> {order.user.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
                </div>

                {/* Items */}
                <div className={styles.billSection}>
                    <h2>Chi tiết đơn hàng</h2><br/>

                    <table className={styles.billTable}>
                    <thead>
                        <tr>
                        <th>Sách</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                        <tr key={item._id}>
                            <td className={styles.productCell}>
                            <img src={item.book.imgURL} alt={item.book.name} />
                            <span>{item.book.name}</span>
                            </td>
                            <td>{item.price.toLocaleString("vi-VN")} VND</td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity).toLocaleString("vi-VN")} VND</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* Payment */}
                <div className={styles.billSection}>
                    <h2>Thanh toán & vận chuyển</h2><br/>
                    <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                    <p><strong>Phương thức vận chuyển:</strong> {order.shippingMethod}</p>

                    {order.deliveryNote && (
                        <p><strong>Ghi chú:</strong> {order.deliveryNote}</p>
                    )}
                </div>

                {/* Total */}
                <div className={styles.billTotal}>
                    <div className={styles.totalRow}>
                        <span>Giá trị đơn hàng</span>
                        <span>{order.cartAmount.toLocaleString("vi-VN")} VND</span>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Phí giao hàng</span>
                        <span>{order.shippingFee.toLocaleString("vi-VN")} VND</span>
                    </div>

                    <div className={`${styles.totalRow} ${styles.final}`}>
                        <span>Tổng thanh toán</span>
                        <span>{order.totalAmount.toLocaleString("vi-VN")} VND</span>
                    </div>
                </div>
            </div>
        
        </>
    )
}