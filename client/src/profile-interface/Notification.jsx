import styles from "./Profile.module.css"
import { useMemo , useContext  } from "react";
import { useOrders } from "../hooks/useOrder"
import { Link } from "react-router-dom"
import { AuthContext } from "../auth-interface/AuthContext"


export default function Notification() {
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
        Cancelled: [styles.cancelled],
    }  


    const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code",
    }).format(value);



    const formatDateTime = (isoString) => {
        const d = new Date(isoString);

        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");

        const dd = String(d.getDate()).padStart(2, "0");
        const MM = String(d.getMonth() + 1).padStart(2, "0");
        const yy = String(d.getFullYear()).slice(-2);

        return `${hh}:${mm} ${dd}/${MM}/${yy}`;
    }


    return (
        <>
            <div className={styles.rightContainer}>
                <p>Trung tâm thông báo</p>

                <div className={styles.NotificationList}>
                    {filteredOrders?.map((item, index) => (
                        <Link key={index} to = {"/bill/" + item._id} className={styles.BillLink}>
                            <div className={styles.NotificationTab} key={index}>
                                <div className={styles.NotificationTitle} key={index}>
                                    <h1>{"Thông báo đơn hàng: " + (item._id)} </h1>
                                    <h1> {formatDateTime(item.createdAt)} </h1>
                                </div>

                                <div className={styles.NotificationInfo}>
                                    <h2> {"Tổng tiền: " + formatVND(item.totalAmount)} </h2>
                                    <h2> {"Địa chỉ giao hàng : " + item.shippingAddress} </h2>
                                    <h2>{"Trạng thái đơn hàng: "} 
                                        <h3 className={Status[item.status]}> {item.status} </h3>
                                        <h2> {"---->"} </h2>
                                        <h3 className={Status[item.status]}> {item.status} </h3>
                                    </h2>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>     
    )
}