import { useContext, useMemo, useState } from "react"
import { useCart } from "../header-footer-interface/hooks/useCart"
import { AuthContext } from "../auth-interface/AuthContext"
import styles from "../cart-interface/Cart.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

export default function Checkout() {
  const { user } = useContext(AuthContext)
  const { data } = useCart()

  const selectedIds = JSON.parse(
    localStorage.getItem("checkout_items") || "[]"
  )

  const items = useMemo(() => {
    return data?.items.filter(item =>
      selectedIds.includes(String(item.id))
    ) || []
  }, [data, selectedIds])

  const [shipping, setShipping] = useState("standard")
  const [payment, setPayment] = useState("cod")

  const shippingFee = shipping === "express" ? 25000 : 10000

  const totalProductPrice = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
  }, [items])

  const totalPrice = totalProductPrice + shippingFee

  return (
    <>
      <PageNameHeader pagename="Checkout" />

      <main className={styles.cartContainer}>
        {/* User info */}
        <div className={styles.infoContainer}>
          <h3 className={styles.infoHeader}>Thông tin người nhận:</h3>
          <p><strong>Họ tên:</strong> {user.fullname}</p>
          <p><strong>SĐT:</strong> {user.phone}</p>
          <p><strong>Địa chỉ:</strong> {user.address}</p>
        </div>

        {/* Products */}
        <div className={styles.headerRowCheckout}>
          <span>Sản Phẩm</span>
          <span>Đơn Giá</span>
          <span>Số Lượng</span>
          <span>Số Tiền</span>
        </div>

        {items.map(item => (
          <div key={item.id} className={styles.itemRowCheckout}>
            <div className={styles.productInfo}>
              <img src={item.imgURL} alt={item.name} />
              <p>{item.name}</p>
            </div>
            <div>{item.price} VND</div>
            <div>{item.quantity}</div>
            <div>{item.price * item.quantity} VND</div>
          </div>
        ))}

        {/* Shipping */}
        <br />
        <div className={styles.infoContainer}>
          <h3 className={styles.infoHeader}>Phương thức vận chuyển</h3>
          <label>
            <input
              type="radio"
              value="standard"
              checked={shipping === "standard"}
              onChange={() => setShipping("standard")}
            />
            Giao hàng tiêu chuẩn (10.000 VND)
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="express"
              checked={shipping === "express"}
              onChange={() => setShipping("express")}
            />
            Giao hàng nhanh (25.000 VND)
          </label>
        </div>

        {/* Payment */}
        <div className={styles.infoContainer}>
          <h3 className={styles.infoHeader}>Phương thức thanh toán</h3>
          <label>
            <input
              type="radio"
              value="cod"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
            Thanh toán khi nhận hàng
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="card"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Thẻ tín dụng / ghi nợ
          </label>

          {payment === "card" && (
            <div className={styles.cardForm}>
              <input placeholder="Số thẻ" />
              <input placeholder="Tên chủ thẻ" />
              <input placeholder="MM/YY" />
              <input placeholder="CVV" />
            </div>
          )}
        </div>

        {/* Note */}
        <div className={styles.infoContainer}>
            <h3 className={styles.infoHeader}>Lời nhắn cho đơn hàng</h3>

            <textarea
                className={styles.orderNote}
                placeholder="Lưu ý cho đơn hàng"
                rows={4}
            />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <span>Tổng đơn hàng</span>
                    <span>{totalProductPrice.toLocaleString("vi-VN")} VND</span>
                </div>

                <div className={styles.summaryRow}>
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString("vi-VN")} VND</span>
                </div>

                <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Tổng thanh toán</span>
                    <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
                </div>
            </div>

            <button className={styles.gradientButton}>
                Đặt hàng
            </button>
        </div>

      </main>
    </>
  )
}
