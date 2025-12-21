import { useCart } from "../header-footer-interface/hooks/useCart"

export default function Cart() {
  const { data, isLoading } = useCart()

  if (isLoading) return <p>Loading cart...</p>
  if (!data || data.items.length === 0)
    return <p>Giỏ hàng trống</p>

  return (
    <main style={{ padding: "20px" }}>
      <h2>Giỏ hàng</h2>

      <ul>
        {data.items.map(item => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            <strong>{item.name}</strong>
            {" "} x {item.quantity}
            {" "} = {item.price * item.quantity} VND
          </li>
        ))}
      </ul>
    </main>
  )
}
