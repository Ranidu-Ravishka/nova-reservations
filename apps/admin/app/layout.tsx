import "./globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex">
          <Sidebar />
          <main className="w-full admin flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
