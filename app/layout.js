import fugaz from "@/fonts/fugaz";
import openSans from "@/fonts/openSans";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Header from "@/components/Header";

export const metadata = {
  title: "Mimblers",
};

export default function RootLayout({ children }) {
  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p
        className={
          "text-azure-radiance-500 duration-200 hover:text-white hover:bg-azure-radiance-500  " +
          fugaz.className
        }
      >
        A Mimblers Production - (Mimblers is not a real company)
      </p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body
          className={
            "w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800  " +
            openSans.className
          }
        >
          {<Header />}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
