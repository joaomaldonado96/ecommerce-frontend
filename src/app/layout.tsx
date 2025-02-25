import "../styles/globals.css"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-6 pt-[100px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}