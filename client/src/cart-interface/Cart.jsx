import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../hooks/useCart";
import styles from "./Cart.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"
import Loading from "../header-footer-interface/Loading"

export default function Cart() {
  const navigate = useNavigate();
  const { data: cart = { items: [] }, isLoading } = useCart()
  const updateQty = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  
  // checkbox state (UI-only)
  const [selected, setSelected] = useState({})

  // Save selected items to localStorage for checkout page (truyền state, refresh thì mất, tự qua cart chọn lại)
  const goCheckout = () => {
    const selectedBookIds  = Object.keys(selected).filter(id => selected[id])
    navigate("/checkout", { state: { selectedBookIds } })
  }

  // select all
  const allChecked = useMemo(
    () =>
      cart.items.length > 0 &&
      cart.items.every(item => selected[item.book._id]),
    [cart.items, selected]
  );

  const toggleAll = () => {
    const next = {}
    if (!allChecked) {
      cart.items.forEach(item => {
        next[item.book._id] = true;
      });
    }
    setSelected(next)
  }

  // Tổng số sách được chọn
  const totalItems = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      if (!selected[item.book._id]) return sum;
      return sum + item.quantity;
    }, 0);
  }, [cart.items, selected]);

  // Tổng tiền được chọn
  const totalPrice = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      if (!selected[item.book._id]) return sum;
      return sum + item.subTotal;
    }, 0);
  }, [cart.items, selected]);

  if (isLoading) return <Loading />
  
  if (!cart || cart.items.length === 0)
    return (
      <>
        <PageNameHeader pagename="Cart" />
        <main className={styles.cartContainer}>
          <div className={styles.emptyCart}>
            <img
              src="img/empty-cart.jpg"
              alt="Empty cart"
              className={styles.emptyImage}
            />
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy chọn thêm sách để tiếp tục mua sắm nhé.</p>

            <Link to="/home" className={styles.backHome}>
              Quay về trang chủ
            </Link>
          </div>
        </main>
      </>
    )

  return (
    <>
      <PageNameHeader pagename="Cart" />

      <main className={styles.cartContainer}>
        {/* Header */}
        <div className={styles.headerRow}>
          <input type="checkbox" checked={allChecked} onChange={toggleAll} />
          <span>Sản Phẩm</span>
          <span>Đơn Giá</span>
          <span>Số Lượng</span>
          <span>Số Tiền</span>
          <span>Thao Tác</span>
        </div>

        {/* Items */}
        {cart.items.map(item => (
          <div key={item._id} className={styles.itemRow}>
            <input
              type="checkbox"
              checked={!!selected[item.book._id]}
              onChange={() =>
                setSelected(prev => ({
                  ...prev,
                  [item.book._id]: !prev[item.book._id]
                }))
              }
            />

            {/* Product */}
            <div className={styles.productInfo}>
              <img src={item.book.imgURL} alt={item.book.name} />
              <div>
                <Link to={`/product/${item.book.slug}`} className={styles.link}>
                  <p className={styles.name}>Sách: {item.book.name}</p>
                </Link>
                <p className={styles.author}>Tác giả: {item.book.author.AuthorName}</p>
              </div>
            </div>

            <div>{item.book.price.toLocaleString("vi-VN")} VND</div>

            {/* Quantity */}
            <div className={styles.quantity}>
              <button 
                disabled={item.quantity <= 1} 
                onClick={() => updateQty.mutate({ bookId: item.book._id, quantity: item.quantity - 1 })}>
                -
              </button> 
              
              <input readOnly value={item.quantity} />

              <button 
                disabled={item.quantity >= item.book.stockQuantity} 
                onClick={() => updateQty.mutate({ bookId: item.book._id, quantity: item.quantity + 1 })}>
                +
              </button> 
            </div>

            <div>{item.subTotal.toLocaleString("vi-VN")} VND</div>

            <button 
              className={styles.remove}
              onClick={() => removeItem.mutate({ bookId: item.book._id })}>
              Xóa
            </button>
          </div>
        ))}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
                <span>Số lượng sách </span>
                <span>{totalItems} cuốn</span>
            </div>

            <div className={styles.summaryRow}>
                <span>Tổng tiền </span>
                <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>


          <button
            disabled={totalItems === 0}
            className={styles.gradientButton}
            onClick={goCheckout}
          >
            Xác nhận đơn hàng
          </button>

        </div>
      </main>
    </>
  )
}