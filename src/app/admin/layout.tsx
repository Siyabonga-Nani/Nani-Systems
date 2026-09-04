import Link from "next/link";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, MessageSquare, Calendar, FileText, FileSignature, Receipt, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border font-bold tracking-tight text-lg">
          Operations
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Dashboard</h3>
            <div className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <LayoutDashboard className="h-4 w-4" /> Overview
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">CRM</h3>
            <div className="space-y-1">
              <Link href="/admin/leads" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <Users className="h-4 w-4" /> Leads
              </Link>
              <Link href="/admin/requests" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <FileText className="h-4 w-4" /> Quote Requests
              </Link>
              <Link href="/admin/consultations" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <Calendar className="h-4 w-4" /> Consultations
              </Link>
              <Link href="/admin/messages" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <MessageSquare className="h-4 w-4" /> Inbox
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Commercial</h3>
            <div className="space-y-1">
              <Link href="/admin/quotes" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <FileText className="h-4 w-4" /> Quotations
              </Link>
              <Link href="/admin/contracts" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <FileSignature className="h-4 w-4" /> Contracts
              </Link>
              <Link href="/admin/invoices" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors">
                <Receipt className="h-4 w-4" /> Invoices
              </Link>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <form action={async () => {
            "use server";
            await logout();
            redirect("/admin/login");
          }}>
            <Button variant="ghost" size="sm" type="submit" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:hidden">
          <h1 className="font-bold tracking-tight">Operations</h1>
          <form action={async () => {
            "use server";
            await logout();
            redirect("/admin/login");
          }}>
            <Button variant="ghost" size="sm" type="submit">Sign Out</Button>
          </form>
        </header>
        <div className="flex-1 overflow-auto bg-background/50 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}