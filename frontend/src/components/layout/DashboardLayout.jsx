import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom"
import { AIChatbot } from "@/components/chat/AIChatbot"

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-7xl">
                    <Outlet />
                </div>
                <AIChatbot />
            </main>
        </div>
    )
}
