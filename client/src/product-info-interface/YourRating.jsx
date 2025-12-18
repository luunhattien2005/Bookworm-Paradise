import styles from "./Product.module.css"
import StarterKit from '@tiptap/starter-kit'
import Placeholder from "@tiptap/extension-placeholder"
import { useEditor, EditorContent } from '@tiptap/react'
import { useState } from "react"

export default function YourRating({ onSubmit }) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isEmpty, setIsEmpty] = useState(true)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Viết đánh giá của bạn tại đây...",
            }),
        ],
        editorProps: {
            attributes: {
                class: styles.ratingEditor,
            },
        },
        onUpdate({ editor }) {
            const text = editor.getText().trim()
            setIsEmpty(text.length === 0)
        },
    })

    if (!editor) return null

    const canSubmit = rating > 0 && !isEmpty

    return(
        <div>
            <div className={styles.ratingHeader}>
                <span>Mức độ hài lòng của bạn: </span>

                <div className={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={
                                star <= (hoverRating || rating)
                                    ? `fa-solid fa-star ${styles.starFilled}`
                                    : `fa-regular fa-star ${styles.starEmpty}`
                            }
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
            </div>
            
            <EditorContent editor={editor} />
            
            <div className={styles.ratingActions}>
                <button 
                    id={styles.submitButton}
                    disabled={!canSubmit}
                    onClick={() => {
                        const html = editor.getHTML();
                        onSubmit({
                            star: rating,
                            content: html,
                        })
                        editor.commands.clearContent()
                        setRating(0)
                        setIsEmpty(true)
                    }}
                >
                    Đánh giá
                </button>
            </div>
        </div>
    )
}