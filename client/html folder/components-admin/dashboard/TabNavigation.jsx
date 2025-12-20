"use client"

export default function TabNavigation({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="flex gap-8 border-b border-border mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === tab.id
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
