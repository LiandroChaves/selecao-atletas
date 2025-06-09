import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../utils/context/ThemeContext";
import { LoadingProvider } from "../utils/context/LoadingProvider";
import LayoutContent from "../utils/utilities/LayoutContent";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Cadastro de Atletas",
    description: "Projeto de gestão de atletas",
    icons: [
        { rel: "apple-touch-icon", url: "/apple-icon.png", sizes: "180x180" },
        { rel: "icon", url: "/favicon.ico" },
        { rel: "manifest", url: "/manifest.json" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <Head>
                {/* Meta tags extras não suportadas no metadata */}
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <body className={inter.className}>
                <ThemeProvider>
                    <LoadingProvider>
                        <LayoutContent>{children}</LayoutContent>
                    </LoadingProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}