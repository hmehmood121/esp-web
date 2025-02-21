"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Images, Users, MessageSquare, Settings, LogOut, Menu } from "lucide-react"
import { getAuth, signOut } from "firebase/auth"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Gallery",
    href: "/admin/dashboard/gallery",
    icon: Images,
  },
  {
    title: "Team",
    href: "/admin/dashboard/team",
    icon: Users,
  },
  {
    title: "Testimonials",
    href: "/admin/dashboard/testimonials",
    icon: MessageSquare,
  },
  {
    title: "Events",
    href: "/admin/dashboard/events",
    icon: MessageSquare,
  },
  // {
  //   title: "Settings",
  //   href: "/admin/dashboard/settings",
  //   icon: Settings,
  // },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      localStorage.removeItem("isAdminLoggedIn")
      window.location.href = "/admin"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full flex flex-col">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <nav className="flex-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-accent ${
                    pathname === item.href ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="p-6">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <SidebarProvider>
        <Sidebar className="hidden md:flex border-r">
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  )
}

