import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4">
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">{msg.reason}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="line-clamp-1 max-w-[200px]">{msg.message}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={msg.status === "UNREAD" ? "destructive" : "outline"}>{msg.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/messages/${msg.id}`} className="text-sm font-medium text-primary hover:underline">
                      Read
                    </Link>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Inbox is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}