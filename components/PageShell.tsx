import {ContactFormModal} from './ContactFormModal'
import {Footer} from './Footer'
import {Header} from './Header'
import {fetchSanity} from '@/lib/sanity'
import {contactFormQuery, settingsQuery} from '@/lib/queries'

export async function PageShell({
  children,
  headerTone = 'dark',
  headerLogo = 'full',
  headerAccent = 'default',
}: {
  children: React.ReactNode
  headerTone?: 'dark' | 'light'
  headerLogo?: 'compact' | 'full'
  headerAccent?: 'default' | 'red' | 'green' | 'brown'
}) {
  const [settings, contactForm] = await Promise.all([
    fetchSanity<Record<string, unknown>>(settingsQuery),
    fetchSanity<Record<string, string>>(contactFormQuery),
  ])

  return (
    <div className={`site-shell ${headerAccent === 'red' ? 'site-shell--red' : ''} ${headerAccent === 'green' ? 'site-shell--green' : ''} ${headerAccent === 'brown' ? 'site-shell--brown' : ''}`}>
      <Header tone={headerTone} logo={headerLogo} accent={headerAccent} settings={settings as never} />
      {children}
      <Footer accent={headerAccent} settings={settings as never} />
      <ContactFormModal accent={headerAccent} labels={contactForm} />
    </div>
  )
}
