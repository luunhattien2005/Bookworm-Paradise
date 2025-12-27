import { useContext, useMemo, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart"
import { useCreateOrder } from "../hooks/useOrder"
import { AuthContext } from "../auth-interface/AuthContext"
import styles from "../cart-interface/Cart.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext)
  const { data: cart = { items: [] } } = useCart();
  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      alert(data.message)
      navigate(`/bill/${data.order._id}`, { replace: true }); 
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Đặt hàng thất bại");
    }
  });

  // Load selected items from state passed via navigate
  const selectedBookIds = location.state?.selectedBookIds || [];

  const items = useMemo(() => {
    if (!cart || cart.items.length === 0) return [];

    return cart?.items.filter(item =>
      selectedBookIds.includes(item.book._id)
    )
  }, [cart, selectedBookIds])

  const [shipping, setShipping] = useState("standard")
  const [payment, setPayment] = useState("COD")

  const shippingFee = shipping === "express" ? 25000 : 10000

  const totalProductPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.subTotal, 0);
  }, [items])

  const totalPrice = totalProductPrice + shippingFee

  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })

  // Minimum validate card info if payment method is card
  const isCardValid = useMemo(() => {
    if (payment !== "card") return true;

    return (
      cardInfo.number.trim() &&
      cardInfo.name.trim() &&
      cardInfo.expiry.trim() &&
      cardInfo.cvv.trim()
    );
  }, [payment, cardInfo]);

  const [deliveryNote, setDeliveryNote] = useState("");

  useEffect(() => {
    if (!selectedBookIds.length) {
      navigate("/cart", { replace: true });
    }
  }, [selectedBookIds, navigate]);

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
          <div key={item._id} className={styles.itemRowCheckout}>
            <div className={styles.productInfo}>
              <img src={item.book.imgURL} alt={item.book.name} />
              <p>{item.book.name}</p>
            </div>
            <div>{item.book.price.toLocaleString("vi-VN")} VND</div>
            <div>{item.quantity}</div>
            <div>{item.subTotal.toLocaleString("vi-VN")} VND</div>
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
              value="COD"
              checked={payment === "COD"}
              onChange={() => setPayment("COD")}
            />
            Thanh toán khi nhận hàng
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="CARD"
              checked={payment === "CARD"}
              onChange={() => setPayment("CARD")}
            />
            Thẻ tín dụng / ghi nợ
          </label>

          {payment === "card" && (
            <div className={styles.cardForm}>
              <input 
                placeholder="Số thẻ"
                value={cardInfo.number}
                onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
              />
              <input 
                placeholder="Tên chủ thẻ" 
                value={cardInfo.name}
                onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
              />
              <input 
                placeholder="MM/YY" 
                value={cardInfo.expiry}
                onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
              />
              <input 
                placeholder="CVV" 
                value={cardInfo.cvv}
                onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* Note */}
        <div className={styles.infoContainer}>
            <h3 className={styles.infoHeader}>Lời nhắn cho đơn hàng</h3>

            <textarea
                className={styles.orderNote}
                placeholder="Lưu ý cho đơn hàng"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
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

          <button
            className={styles.gradientButton}
            disabled={items.length === 0 || !isCardValid || createOrder.isLoading}
            onClick={() => {
              createOrder.mutate({
                shippingAddress: user.address,
                paymentMethod: payment.toUpperCase(), // COD / CARD
                shippingMethod: shipping,
                shippingFee: shippingFee,
                deliveryNote: deliveryNote.trim(),
              });
            }}
          >
            {createOrder.isLoading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>

      </main>
    </>
  )
}
