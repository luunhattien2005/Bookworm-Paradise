import { createContext, useContext, useRef, useState } from "react";
import PageNameHeader from "./PageNameHeader";
import styles from "./HeaderFooter.module.css";

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
	const dialogRef = useRef(null);

	const [title, setTitle] = useState("");
    const [messages, setMessages] = useState([]);
	const [isDialogON, setDialog] = useState(false);

	const showDialog = (msg1, msg2) => {
		setTitle(msg1);
		setMessages(Array.isArray(msg2) ? msg2 : [msg2]);
		setDialog(true);
		dialogRef.current?.showModal();
	};

	const closeDialog = () => {
		setDialog(false);
		dialogRef.current?.close();
	};

	return (
		<DialogContext.Provider value={{ showDialog }}>
			{children}

			<dialog ref={dialogRef} className={styles.dialog} style={isDialogON ? { display: "grid" } : { display: "none" }}>
				<PageNameHeader pagename="Error"/>
				<p>{title}</p>

				{messages.map((line, index) => (
       			    <p1 key={index}>{line}</p1>
    		    ))}

				<button onClick={closeDialog}>Đóng</button>
			</dialog>
		</DialogContext.Provider>
	);
}

export function useDialog() {
	return useContext(DialogContext);
}
