import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../header-footer-interface/hooks/useCart"
import styles from "./Cart.module.css"
import PageNameHeader from "../header-footer-interface/PageNameHeader"

export default function Cart() {
  const { data, isLoading } = useCart()
  
  // checkbox state (UI-only)
  const [selected, setSelected] = useState({})
  const [cartItems, setCartItems] = useState([])

  if (isLoading) return <p>Loading cart...</p>
  if (!data || data.items.length === 0)
    return <p>Giỏ hàng trống</p>

  useEffect(() => {
    if (data?.items) {
      setCartItems(data.items)
    }
  }, [data])

  // Save selected items to localStorage for checkout page
  const goCheckout = () => {
    const selectedIds = Object.keys(selected).filter(id => selected[id])
    localStorage.setItem("checkout_items", JSON.stringify(selectedIds))
  }

  // Handlers to increase/decrease quantity - call api later
  const increaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  // select all
  const allChecked = useMemo(() => {
    return cartItems.length > 0 &&
      cartItems.every(item => selected[item.id])
  }, [cartItems, selected])

  const toggleAll = () => {
    const next = {}
    if (!allChecked) {
      cartItems.forEach(item => {
        next[item.id] = true
      })
    }
    setSelected(next)
  }

  // Total price of selected items
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      if (!selected[item.id]) return sum
      return sum + item.quantity
    }, 0)
  }, [cartItems, selected])


  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      if (!selected[item.id]) return sum
      return sum + item.quantity * item.price
    }, 0)
  }, [cartItems, selected])


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
        {cartItems.map(item => (
          <div key={item.id} className={styles.itemRow}>
            <input
              type="checkbox"
              checked={!!selected[item.id]}
              onChange={() =>
                setSelected(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id]
                }))
              }
            />

            {/* Product */}
            <div className={styles.productInfo}>
              <img src={item.imgURL} alt={item.name} />
              <div>
                <Link to={`/product/${item.slug}`} className={styles.link}>
                  <p className={styles.name}>Sách: {item.name}</p>
                </Link>
                <p className={styles.author}>Tác giả: {item.author}</p>
              </div>
            </div>

            <div>{item.price} VND</div>

            {/* Quantity */}
            <div className={styles.quantity}>
              <button disabled={item.quantity <= 1} onClick={() => decreaseQty(item.id)}>-</button> {/* Call api sau */}
              <input
                type="number"
                value={item.quantity}
                min={1}
                max={item.stock}
                readOnly // Call api sau
              />
              <button disabled={item.quantity >= item.stock} onClick={() => increaseQty(item.id)}>+</button> {/* Call api sau */}
            </div>

            <div>{item.price * item.quantity} VND</div>

            <button className={styles.remove}>Xóa</button>
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

          <Link to="/checkout" style={{width: "100%"}}>
            <button
              disabled={totalItems === 0}
              className={styles.gradientButton}
              onClick={goCheckout}
            >
              Xác nhận đơn hàng
            </button>
          </Link>
        </div>
      </main>
    </>
  )
}