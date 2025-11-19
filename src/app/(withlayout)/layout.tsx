
import { PendingActionWrapper } from "@/components/PendingActionWrapper";
import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex-1 flex flex-col">
        <NavBar />

        <main className="flex-1 pt-24">
          {children}
        </main>
        <PendingActionWrapper />

        <Footer />
      </div>
    </div>



  );
}
