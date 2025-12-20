"use client"

import { useState } from "react"

export default function AddBookModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        stock: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" ? Number.parseFloat(value) || "" : name === "stock" ? Number.parseInt(value) || "" : value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.title && formData.author && formData.price && formData.stock) {
            onAdd(formData)
            setFormData({ title: "", author: "", price: "", stock: "" })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-8 max-w-md w-full shadow-lg">
                <h2 className="text-2xl font-bold text-foreground mb-6">Add New Book</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Book title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Author name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-input rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
