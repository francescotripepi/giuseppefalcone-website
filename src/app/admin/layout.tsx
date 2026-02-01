export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin - Giuseppe Falcone",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#0a0a0a]">{children}</div>;
}
