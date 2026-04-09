import { Inter, Major_Mono_Display, Old_Standard_TT, Playfair, Montserrat } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import { motion, AnimatePresence } from 'framer-motion'
import HeaderServer from '../../blocks/global/Header/server'
import FooterServer from '../../blocks/global/Footer/server'
import Image from 'next/legacy/image'

const inter = Inter({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

const montserrat = Montserrat({
  weight: '400',
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

const monoMajor = Major_Mono_Display({
  weight: '400',
  variable: '--font-monoMajor',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair({
  // weight : '400',
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
        className={`${monoMajor.variable} ${inter.variable} ${playfair.variable} ${old.variable} ${montserrat.variable}`}
      >
        <HeaderServer />
        {/* <Nav/> */}
        <AnimatePresence>{children}</AnimatePresence>
        <FooterServer />
      </body>
    </html>
  )
}
