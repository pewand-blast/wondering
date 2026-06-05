import {Footer} from './Footer'
import {Header} from './Header'
import {fetchSanity} from '@/lib/sanity'
import {settingsQuery} from '@/lib/queries'

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
  const settings = await fetchSanity<Record<string, unknown>>(settingsQuery)

  return (
    <div className={`site-shell ${headerAccent === 'red' ? 'site-shell--red' : ''} ${headerAccent === 'green' ? 'site-shell--green' : ''} ${headerAccent === 'brown' ? 'site-shell--brown' : ''}`}>
      <Header tone={headerTone} logo={headerLogo} accent={headerAccent} settings={settings as never} />
      {children}
      <Footer accent={headerAccent} settings={settings as never} />
    </div>
  )
}
