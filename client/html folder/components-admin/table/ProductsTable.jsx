"use client"

export default function ProductsTable({ books, onEdit, onDelete }) {
    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted border-b border-border">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Author</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-foreground">{book.title}</td>
                            <td className="px-6 py-4 text-sm text-foreground">{book.author}</td>
                            <td className="px-6 py-4 text-sm text-foreground">${book.price}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                                    {book.stock}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">{book.rating}</td>
                            <td className="px-6 py-4 text-sm space-x-2">
                                <button
                                    onClick={() => onEdit(book)}
                                    className="px-3 py-1 bg-background border border-border text-foreground rounded hover:bg-muted transition-colors text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(book.id)}
                                    className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
