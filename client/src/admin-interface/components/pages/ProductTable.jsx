"use client"

import { useState } from "react"
import SearchBar from "./SearchBar"
import ProductsTable from "../table/ProductsTable"
import AddBookModal from "../modals/AddBookModal"
import EditBookModal from "../modals/EditBookModal"

const initialBooks = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 14.99, stock: 45, rating: "4.5/5 (128)" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 12.99, stock: 32, rating: "4.8/5 (256)" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 11.99, stock: 28, rating: "4.4/5 (189)" },
    { id: 4, title: "Educated", author: "Tara Westover", price: 18.99, stock: 56, rating: "4.7/5 (412)" },
    { id: 5, title: "The Midnight Library", author: "Matt Haig", price: 16.99, stock: 41, rating: "4.6/5 (342)" },
    { id: 6, title: "Atomic Habits", author: "James Clear", price: 17.99, stock: 78, rating: "4.9/5 (523)" },
]

export default function ProductsPage() {
    const [books, setBooks] = useState(initialBooks)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingBook, setEditingBook] = useState(null)

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddBook = (newBook) => {
        const book = {
            ...newBook,
            id: Math.max(...books.map((b) => b.id), 0) + 1,
            rating: "0/5 (0)",
        }
        setBooks([...books, book])
        setShowAddModal(false)
    }

    const handleEditBook = (updatedBook) => {
        setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
        setShowEditModal(false)
        setEditingBook(null)
    }

    const handleDeleteBook = (id) => {
        setBooks(books.filter((book) => book.id !== id))
    }

    const handleEditClick = (book) => {
        setEditingBook(book)
        setShowEditModal(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    Add New Book
                </button>
            </div>

            <ProductsTable books={filteredBooks} onEdit={handleEditClick} onDelete={handleDeleteBook} />

            {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} onAdd={handleAddBook} />}

            {showEditModal && editingBook && (
                <EditBookModal
                    book={editingBook}
                    onClose={() => {
                        setShowEditModal(false)
                        setEditingBook(null)
                    }}
                    onSave={handleEditBook}
                />
            )}
        </div>
    )
}
