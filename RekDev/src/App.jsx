import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { SearchView } from './components/views/SearchView';
import { ResultsView } from './components/views/ResultsView';
import { DetailView } from './components/views/DetailView';
import { DashboardView } from './components/views/DashboardView';
import { LibraryView } from './components/views/LibraryView';
import { ManageView } from './components/views/ManageView';
import { AccountView } from './components/views/AccountView';
import { Icon } from './components/Icons';

function MainLayout() {
  const { currentView, isLoggedIn } = useApp();

  // Route guard fallback di level layout: jika belum login, kunci search, results, dan dashboard
  const isProtectedView = !isLoggedIn && (currentView === 'search' || currentView === 'results' || currentView === 'dashboard');

  return (
    <div className="app-shell">
      <Sidebar />

      <main id="top" className="main-content">
        <Topbar />

        {isProtectedView && <AccountView />}
        {!isProtectedView && (
          <>
            {currentView === 'search' && <SearchView />}
            {currentView === 'results' && <ResultsView />}
            {currentView === 'detail' && <DetailView />}
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'library' && <LibraryView />}
            {currentView === 'manage' && <ManageView />}
            {currentView === 'account' && <AccountView />}
          </>
        )}

        <footer className="page-footer">
          <span>&copy; 2024 RekDev</span>
          <span>
            Data referensi dari <strong>Steam</strong> <i>&middot;</i> Dibuat untuk membantu keputusan developer {' '}
            
          </span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
