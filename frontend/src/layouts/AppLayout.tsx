import { useState, type ReactNode } from 'react'
import { NavigationItem } from '../components/NavigationItem'

type AppLayoutProps = {
  children?: ReactNode
  onLogout?: () => void
}

const navigationItems = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Wallet', href: '#wallet' },
  { label: 'Transfers', href: '#transfers' },
  { label: 'Transactions', href: '#transactions' },
  { label: 'Profile', href: '#profile' },
]

export function AppLayout({ children, onLogout }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <a className="brand" href="#dashboard" onClick={closeMobileMenu}>
          NairaFlow
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="app-navigation"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          Menu
        </button>
      </header>

      <aside
        id="app-navigation"
        className={`app-sidebar${isMobileMenuOpen ? ' app-sidebar--open' : ''}`}
      >
        <a className="brand" href="#dashboard" onClick={closeMobileMenu}>
          NairaFlow
        </a>

        <nav className="sidebar-navigation" aria-label="Main navigation">
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={item.label}
              {...item}
              isActive={index === 0}
              onClick={closeMobileMenu}
            />
          ))}
        </nav>

        <button className="logout-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </aside>

      <main className="app-main">
        {children ?? (
          <section className="welcome-placeholder" aria-labelledby="welcome-heading">
            <h1 id="welcome-heading" className="heading-1">
              Welcome to NairaFlow
            </h1>
            <p className="body-text">
              Your wallet experience will appear here as the application is built.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
