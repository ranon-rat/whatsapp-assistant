import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
require('dotenv').config();
export const metadata: Metadata = {
    title: 'archives',
    description: 'archives',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className + " bg-0f172a"}>
                <div id="big">
                    <br />
                    <h1
                        className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        Archives
                    </h1>

                </div>
                {children}
            </body>
        </html>
    )
}