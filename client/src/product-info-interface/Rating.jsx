import styles from "./Product.module.css"
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'

export default function Rating({ onSubmit }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Viết đánh giá của bạn tại đây...</p>',
        editorProps: {
            attributes: {
                class: styles.ratingEditor,
            },
        },
    })

    if (!editor) return null

    return(
        <div>
            <EditorContent editor={editor} />
            <div className={styles.ratingActions}>
                <button 
                    id={styles.submitButton}
                    onClick={() => {
                        const html = editor.getHTML();
                        onSubmit(html);
                }}>
                    Đánh giá
                </button>
            </div>
        </div>
    )
}