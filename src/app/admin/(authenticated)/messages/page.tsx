import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Mail, MailOpen } from "lucide-react";

async function getMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-white/60 mt-1">Contact form submissions</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`glass rounded-xl p-6 ${!message.isRead ? "border-l-4 border-[#ff0080]" : ""}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {message.isRead ? (
                  <MailOpen className="w-5 h-5 text-white/40" />
                ) : (
                  <Mail className="w-5 h-5 text-[#ff0080]" />
                )}
                <div>
                  <h3 className="font-semibold">{message.name}</h3>
                  <p className="text-sm text-white/40">{message.email}</p>
                </div>
              </div>
              <span className="text-sm text-white/40">
                {format(message.createdAt, "MMM d, yyyy h:mm a")}
              </span>
            </div>
            {message.subject && (
              <p className="text-sm font-medium mb-2">{message.subject}</p>
            )}
            <p className="text-white/70 whitespace-pre-wrap">{message.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="glass rounded-xl p-8 text-center text-white/40">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
