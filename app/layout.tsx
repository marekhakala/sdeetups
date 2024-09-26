import { Inter } from 'next/font/google'
import { Providers } from './providers'
import HeaderBar from '@/components/headerbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <html lang="en">
        <Providers>
          <body className={inter.className}>
            <HeaderBar />
            <div>{children}</div>
          </body>
        </Providers>
      </html>
    )
}
