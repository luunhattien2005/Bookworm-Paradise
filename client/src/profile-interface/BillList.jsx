import styles from "./Profile.module.css"
import { useMemo , useContext  } from "react";
import { useOrders } from "../hooks/useOrder"
import { Link } from "react-router-dom"
import { AuthContext } from "../auth-interface/AuthContext"


export default function BillList() {
    const { data: Draftorder} = useOrders()
    const { user } = useContext(AuthContext)

    // Filtered Order (Sort + Remove)
   const filteredOrders = useMemo(() => {
    if (!Array.isArray(Draftorder) || !user?._id) return [];

    return Draftorder
        .filter(Draftorder => Draftorder.user === user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [Draftorder, user]);



    const Status = {
        Pending: [styles.pending],
        Processing: [styles.processing],
        Shipping: [styles.shipping],
        Delivered: [styles.delivered],
        Cancelled: [styles.cancelled]
    }

    const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code",
    }).format(value);


    return (
        <>
            <div className={styles.rightContainer}>
                <p>Lịch sử giao dịch</p>

                <div className={styles.BillList}>
                    {filteredOrders?.map((item, index) => (
                        <Link key={index} to = {"/bill/" + item._id} className={styles.BillLink}>
                            <div className={styles.BillInfoTab} key={index}>
                                <img src="/img/Job_Application.png" alt="" />

                                <div className={styles.BillInfoTabLeft} key={index}>
                                    <p1>{"Hóa đơn mua hàng ngày " + new Date(item.createdAt).toLocaleDateString("vi-VN")}</p1>
                                    <p2>{"Mã hóa đơn: " + item._id}</p2>
                                    <p2>{"Tổng tiền: " + formatVND(item.totalAmount)}</p2>
                                    <p2>{"Trạng thái: "} 
                                        <p3 className={Status[item.status]} style={{padding: "1px 5px", borderRadius: "10px"}}> {item.status} </p3>
                                    </p2>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>     
    )
}