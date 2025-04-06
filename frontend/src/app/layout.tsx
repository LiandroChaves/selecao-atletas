import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../utils/context/ThemeContext";
import { LoadingProvider } from "../utils/context/LoadingProvider";
import LayoutContent from "../utils/utilities/LayoutContent"; // import novo

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Cadastro de Atletas",
    description: "Projeto de gestão de atletas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
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
