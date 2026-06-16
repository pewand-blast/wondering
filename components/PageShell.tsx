import {ContactFormModal} from './ContactFormModal'
import {Footer} from './Footer'
import {Header} from './Header'
import {fetchSanity} from '@/lib/sanity'
import {shellQuery} from '@/lib/queries'

type ShellData = {
  settings?: Record<string, unknown> | null
  contactForm?: Record<string, string> | null
  applicationForm?: Record<string, unknown> | null
}

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
  const shell = await fetchSanity<ShellData>(shellQuery)
  const settings = shell?.settings
  const contactForm = shell?.contactForm
  const applicationForm = shell?.applicationForm

  return (
    <div className={`site-shell ${headerAccent === 'red' ? 'site-shell--red' : ''} ${headerAccent === 'green' ? 'site-shell--green' : ''} ${headerAccent === 'brown' ? 'site-shell--brown' : ''}`}>
      <Header tone={headerTone} logo={headerLogo} accent={headerAccent} settings={settings as never} />
      {children}
      <Footer accent={headerAccent} settings={settings as never} />
      <ContactFormModal accent={headerAccent} applicationLabels={applicationForm} labels={contactForm} />
    </div>
  )
}
