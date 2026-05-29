import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CircleUserRound } from "lucide-react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import Home from "@/pages/Home"
import ClientsPage from "@/pages/ClientsPage"

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center justify-between border-b px-6">
            <SidebarTrigger />
            <button className="rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <CircleUserRound className="size-8" />
            </button>
          </header>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/klijenti" element={<ClientsPage />} />
            </Routes>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
