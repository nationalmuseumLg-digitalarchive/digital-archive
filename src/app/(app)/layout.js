import { Major_Mono_Display, Old_Standard_TT, Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/PageTransition'
import HeaderServer from '../../blocks/global/Header/server'
import FooterServer from '../../blocks/global/Footer/server'



const montserrat = Montserrat({
  // weight: '400',
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})



const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const old = Old_Standard_TT({
  weight: '400',
  variable: '--font-old',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'National Museum Digital Archive',
  description: 'Digitised archives of the National Museum Library and Archives (NMLA) collection.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${playfair.variable} ${old.variable} ${montserrat.variable}`}
      >
        <HeaderServer />
        <PageTransition>{children}</PageTransition>
        <FooterServer />
      </body>
    </html>
  )
}
