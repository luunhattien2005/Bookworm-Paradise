let cart = []

export async function getCart() {
  return {
    items: cart,
    totalItems: cart.reduce((sum, i) => sum + i.quantity, 0)
  }
}

export async function addToCart(product) {
  const found = cart.find(i => i.id === product.id)
  if (found) {
    found.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  return { success: true }
}