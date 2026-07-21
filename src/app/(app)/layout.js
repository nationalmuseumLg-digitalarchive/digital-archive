import { Major_Mono_Display, Old_Standard_TT, Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import HeaderServer from '../../blocks/global/Header/server'
import FooterServer from '../../blocks/global/Footer/server'
import SearchOverlay from '@/components/SearchOverlay'



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
  // Required so `alternates.canonical` and openGraph URLs resolve to absolute
  // URLs. Without it Next emits relative canonicals, which search engines ignore.
  metadataBase: new URL('https://lagosmuseumarchives.ng'),
  title: {
    default: 'National Museum Digital Archive',
    template: '%s | National Museum Digital Archive',
  },
  description: 'Digitised archives of the National Museum Library and Archives (NMLA) collection.',
  openGraph: {
    type: 'website',
    siteName: 'National Museum Digital Archive',
    title: 'National Museum Digital Archive',
    description:
      'Digitised archives of the National Museum Library and Archives (NMLA) collection.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${playfair.variable} ${old.variable} ${montserrat.variable}`}
      >
        <SearchOverlay />
        <HeaderServer />
        {children}
        <FooterServer />
      </body>
    </html>
  )
}
