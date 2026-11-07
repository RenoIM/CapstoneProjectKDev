import React from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './Icons';

export function Sidebar() {
  const { currentView, navigateTo, isLoggedIn, role, setRole, logout, userName } = useApp();

  const isSearchActive = currentView === 'search' || currentView === 'results';

  const roleLabel = isLoggedIn
    ? (role === 'admin' ? 'Admin · Demo' : 'Developer · Demo')
    : 'Belum masuk';

  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      <a
        className="brand"
        href="#top"
        aria-label="RekDev beranda"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('search');
        }}
      >
        <span className="brand-mark" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span>
          Rek<span className="brand-light">Dev</span>
        </span>
      </a>

      <div className="nav-label">WORKSPACE</div>

      <nav className="main-nav">
        <a
          className={`nav-item ${isSearchActive ? 'active' : ''}`}
          href="#search"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('search');
          }}
          aria-current={isSearchActive ? 'page' : undefined}
          title={!isLoggedIn ? 'Masuk untuk membuka Cari game' : undefined}
        >
          <span className="nav-icon">
            <Icon name="search" />
          </span>
          <span>Cari game</span>
          {isSearchActive && <span className="nav-dot"></span>}
          {!isLoggedIn && (
            <span
              className="soon-label flex items-center gap-1"
              style={{ background: '#2c2518', color: '#f0c773', border: '1px solid #4a3c22', padding: '2px 5px', fontSize: '8px' }}
              title="Perlu masuk"
            >
              <Icon name="lock" width="9px" height="9px" />
            </span>
          )}
        </a>

        <a
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          href="#market"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('dashboard');
          }}
          aria-current={currentView === 'dashboard' ? 'page' : undefined}
          title={!isLoggedIn ? 'Masuk untuk membuka Analisis pasar' : undefined}
        >
          <span className="nav-icon">
            <Icon name="chart" />
          </span>
          <span>Analisis pasar</span>
          {currentView === 'dashboard' && <span className="nav-dot"></span>}
          {!isLoggedIn && (
            <span
              className="soon-label flex items-center gap-1"
              style={{ background: '#2c2518', color: '#f0c773', border: '1px solid #4a3c22', padding: '2px 5px', fontSize: '8px' }}
              title="Perlu masuk"
            >
              <Icon name="lock" width="9px" height="9px" />
            </span>
          )}
        </a>

        <a
          className={`nav-item ${currentView === 'library' ? 'active' : ''}`}
          href="#library"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('library');
          }}
          aria-current={currentView === 'library' ? 'page' : undefined}
        >
          <span className="nav-icon">
            <Icon name="compass" />
          </span>
          <span>Jelajah game</span>
          {currentView === 'library' && <span className="nav-dot"></span>}
        </a>

        {isLoggedIn && role === 'admin' && (
          <a
            className={`nav-item ${currentView === 'manage' ? 'active' : ''}`}
            href="#manage-data"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('manage');
            }}
            aria-current={currentView === 'manage' ? 'page' : undefined}
          >
            <span className="nav-icon">
              <Icon name="database" />
            </span>
            <span>Kelola data</span>
            {currentView === 'manage' && <span className="nav-dot"></span>}
          </a>
        )}

        <a
          className={`nav-item ${currentView === 'account' ? 'active' : ''}`}
          href="#account"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('account');
          }}
          aria-current={currentView === 'account' ? 'page' : undefined}
        >
          <span className="nav-icon">
            <Icon name="user" />
          </span>
          <span>{isLoggedIn ? 'Akun' : 'Masuk'}</span>
          {currentView === 'account' && <span className="nav-dot"></span>}
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <Icon name="bulb" />
          </div>
          <strong>Ide bagus dimulai dari riset.</strong>
          <p>Temukan peluang di antara ribuan game Steam.</p>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('search');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Cara kerja <span><Icon name="arrow-right" /></span>
          </a>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#292b35] flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer select-none border ${
              isLoggedIn
                ? role === 'admin'
                  ? 'bg-[#372644] text-[#c7b7ff] border-[#553b6a]'
                  : 'bg-[#202919] text-[#d7f7a6] border-[#42592d]'
                : 'bg-[#22252e] text-[#9295a3] border-[#343742]'
            }`}
            id="session-avatar"
            onClick={() => navigateTo('account')}
            title="Buka profil akun"
          >
            {isLoggedIn ? (role === 'admin' ? 'A' : 'D') : 'P'}
          </div>

          <div
            className="flex flex-col min-w-0 flex-1 cursor-pointer"
            onClick={() => navigateTo('account')}
            title="Buka profil akun"
          >
            <strong className="text-[11px] font-semibold text-[#f4f3f8] truncate" id="session-name">
              {isLoggedIn
                ? (userName || (role === 'admin' ? 'Administrator' : 'Developer'))
                : 'Pengunjung'}
            </strong>
            <span
              className={`text-[9px] font-medium truncate ${
                isLoggedIn
                  ? role === 'admin'
                    ? 'text-[#c7b7ff]'
                    : 'text-[#c7f36b]'
                  : 'text-[#8c8e9a]'
              }`}
              id="session-label"
            >
              {isLoggedIn
                ? (role === 'admin' ? 'Admin' : 'Developer (User)')
                : 'Belum masuk'}
            </span>
          </div>

          {isLoggedIn && (
            <button
              className="shrink-0 p-1.5 rounded hover:bg-[#342326] text-[#ff9da7] hover:text-[#ffb3b3] border border-transparent hover:border-[#624043] transition-colors cursor-pointer"
              type="button"
              onClick={logout}
              title="Keluar dari sesi"
              aria-label="Keluar"
            >
              <Icon name="log-out" width="13px" height="13px" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
