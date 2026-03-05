import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface LinkItem { to: string; label: string }
const workspaceLinks: LinkItem[] = [
  { to: '/', label: '📊 Dashboard' },
  { to: '/upload', label: '📤 Upload Resume' },
]

// quick action definitions; handlers are stubs that can be replaced
interface ActionItem {
  key: string
  label: string
  style: React.CSSProperties
  hover?: (e: React.MouseEvent<HTMLButtonElement>) => void
  leave?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onClick?: () => void
}
const quickActions: ActionItem[] = [
  {
    key: 'new-analysis',
    label: '✨ New Analysis',
    style: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      transition: 'all 0.3s ease',
    },
    hover: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
    },
    leave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translateY(0)'
    },
    onClick: () => {
      // TODO: implement action
      console.log('new analysis clicked')
    },
  },
  {
    key: 'export-csv',
    label: '📥 Export CSV',
    style: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      background: 'rgba(102, 126, 234, 0.15)',
      color: '#667eea',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      transition: 'all 0.3s ease',
    },
    hover: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.25)'
    },
    leave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)'
    },
    onClick: () => {
      // TODO: implement export
      console.log('export clicked')
    },
  },
]

export default function MainLayout() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      {/* Main Content */}
      <Navbar />
      <div className="container-fluid" style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', padding: '32px 24px' }}>
        <div className="row g-4">
          {/* Sidebar */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div style={{ position: 'sticky', top: '24px' }}>
              {/* Workspace Navigation */}
              <div className="glass animate-slide-in-left" style={{ borderRadius: '12px', padding: '20px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
                <div className="gradient-text" style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>🏢 Workspace</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {workspaceLinks.map(({to,label}) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
                    style={({isActive}) => ({
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.3s ease',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(240, 147, 251, 0.2))'
                        : 'transparent',
                    })}
                  >
                    {label}
                  </NavLink>
                ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass animate-slide-in-left" style={{ borderRadius: '12px', padding: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.18)', animationDelay: '0.1s' }}>
                <div className="gradient-text" style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>⚡ Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {quickActions.map(({key,label,style,hover,leave,onClick}) => (
                    <button
                      key={key}
                      className="btn"
                      style={style}
                      onMouseOver={hover}
                      onMouseOut={leave}
                      onClick={onClick}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-lg-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

