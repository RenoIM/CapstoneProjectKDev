import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './Icons';

export function Topbar() {
  const { currentView, detailSource, navigateTo, updateLogs } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const dropdownRef = useRef(null);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Baru saja';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs)) return 'Baru saja';
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} hari lalu`;
  };

  // 5 Update terbaru dari update_logs Supabase
  const notifications = useMemo(() => {
    if (updateLogs && updateLogs.length > 0) {
      return updateLogs.slice(0, 5).map((log) => {
        let title = 'Pembaruan Data';
        let targetView = 'library';

        if (log.action === 'INSERT_GAME') {
          title = 'Game Baru Ditambahkan';
          targetView = 'library';
        } else if (log.action === 'UPDATE_GAME') {
          title = 'Data Game Diperbarui';
          targetView = 'library';
        } else if (log.action === 'DELETE_GAME') {
          title = 'Game Dihapus dari Katalog';
          targetView = 'manage';
        } else if (log.action === 'SEED_INITIAL_DATA') {
          title = 'Inisialisasi Data Game';
          targetView = 'library';
        }

        return {
          id: log.id,
          title,
          desc: log.notes || `Aksi ${log.action} oleh ${log.admin_id || 'Admin'}`,
          time: formatTimeAgo(log.created_at),
          unread: !readIds.includes(log.id),
          targetView
        };
      });
    }

    return [
      {
        id: 'welcome',
        title: 'Selamat Datang di RekDev',
        desc: 'Mulai cari referensi game yang sejalan dengan ide game impianmu.',
        time: 'Baru saja',
        unread: !readIds.includes('welcome'),
        targetView: 'search'
      }
    ];
  }, [updateLogs, readIds]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'search':
      case 'results':
        return 'Cari game';
      case 'detail':
        return detailSource === 'library' ? 'Jelajah game / Detail' : 'Cari game / Detail';
      case 'dashboard':
        return 'Analisis pasar';
      case 'library':
        return 'Jelajah game';
      case 'manage':
        return 'Kelola data';
      case 'account':
        return 'Akun & Profil';
      default:
        return 'Cari game';
    }
  };

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="crumb-slash">/</span>
        <strong id="crumb-current">{getBreadcrumbTitle()}</strong>
      </div>

      <div className="topbar-actions relative" ref={dropdownRef}>
        {/* Bell Notification Button */}
        <div className="relative">
          <button
            className={`icon-button transition-colors ${showNotifications ? 'border-[#c7f36b] text-[#c7f36b]' : ''}`}
            aria-label="Pemberitahuan"
            type="button"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Lihat 5 aktivitas terbaru"
          >
            <Icon name="bell" />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-[#191c24] border border-[#30333d] rounded-xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#292c35] bg-[#1d202b]">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-xs text-[#f4f3f8]">5 Update Terbaru</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#302a48] text-[#c7b7ff] text-[9px] font-bold">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[10px] text-[#c7f36b] hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#252833] max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.targetView) navigateTo(item.targetView);
                      setShowNotifications(false);
                      setReadIds(prev => [...prev, item.id]);
                    }}
                    className={`p-3.5 hover:bg-[#20242e] transition-colors cursor-pointer flex gap-3 items-start ${
                      item.unread ? 'bg-[#1b2029]' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#c7f36b]" style={{ opacity: item.unread ? 1 : 0.2 }}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-[11px] font-semibold text-[#eeeef3] truncate">
                          {item.title}
                        </strong>
                        <span className="text-[9px] text-[#707380] shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-[#9a9ca8] leading-relaxed m-0">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 text-center border-t border-[#252833] bg-[#161820]">
                <span className="text-[9px] text-[#707380]">
                  Aktivitas tersinkronisasi otomatis dari database Supabase
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

