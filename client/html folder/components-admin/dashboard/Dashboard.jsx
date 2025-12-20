"use client"

import { useState } from "react"
import TabNavigation from "./TabNavigation"
import ProductsPage from "../pages/ProductsPage"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("products")

    const tabs = [
        { id: "products", label: "Products" },
        { id: "orders", label: "Orders" },
        { id: "users", label: "Users" },
        { id: "analytics", label: "Analytics" },
    ]

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "products" && <ProductsPage />}
                {activeTab === "orders" && (
                    <div className="p-8 text-center text-muted-foreground">Orders section coming soon</div>
                )}
                {activeTab === "users" && (
                    <div className="p-8 text-center text-muted-foreground">Users section coming soon</div>
                )}
                {activeTab === "analytics" && (
                    <div className="p-8 text-center text-muted-foreground">Analytics section coming soon</div>
                )}
            </div>
        </main>
    )
}
