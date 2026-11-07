import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../Icons';
import { supabase } from '../../lib/supabase';
import { hashPassword } from '../../utils/crypto';

export function AccountView() {
  const {
    login,
    logout,
    isLoggedIn,
    role,
    userEmail,
    userName,
    routeGuardFeedback,
    setRouteGuardFeedback,
    navigateTo
  } = useApp();

  const [activePanel, setActivePanel] = useState('login'); // 'login' | 'signup' | 'recovery'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFeedback, setLoginFeedback] = useState('');
  const [loginFeedbackState, setLoginFeedbackState] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFeedback, setSignupFeedback] = useState('');

  // Recovery form state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [recoveryFeedback, setRecoveryFeedback] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const DEMO_RESET_CODE = 'REKDEV-2024';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setRouteGuardFeedback('');

    const email = loginEmail.trim().toLowerCase();
    const pass = loginPassword;
    const hashedPass = await hashPassword(pass);

    try {
      // 1. Cek langsung ke database Supabase tabel 'users'
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (dbUser && (dbUser.password === hashedPass || dbUser.password === pass)) {
        setLoginFeedbackState('success');
        setLoginFeedback(`Berhasil masuk sebagai ${dbUser.role === 'admin' ? 'Administrator' : 'Developer'}.`);
        login({ email: dbUser.email, role: dbUser.role || 'developer', name: dbUser.name || 'User' }, 'search');
        return;
      }

      // 2. Akun bawaan demo sebagai cadangan
      if (email === 'admin@rekdev.id' && (pass === 'admin-demo' || hashedPass === 'admin-demo')) {
        setLoginFeedbackState('success');
        setLoginFeedback('Berhasil masuk sebagai Administrator.');
        login({ email: 'admin@rekdev.id', role: 'admin', name: 'Administrator' }, 'search');
        return;
      }

      if (email === 'developer@rekdev.id' && (pass === 'rekdev-demo' || hashedPass === 'rekdev-demo')) {
        setLoginFeedbackState('success');
        setLoginFeedback('Berhasil masuk sebagai Developer.');
        login({ email: 'developer@rekdev.id', role: 'developer', name: 'Developer' }, 'search');
        return;
      }

      setLoginFeedbackState('error');
      setLoginFeedback('Email atau kata sandi salah. Silakan periksa kembali.');
    } catch (err) {
      console.error('Login error:', err);
      // Fallback akun bawaan jika tabel belum dibuat di Supabase
      if (email === 'admin@rekdev.id' && pass === 'admin-demo') {
        login({ email: 'admin@rekdev.id', role: 'admin', name: 'Administrator' }, 'search');
        return;
      }
      if (email === 'developer@rekdev.id' && pass === 'rekdev-demo') {
        login({ email: 'developer@rekdev.id', role: 'developer', name: 'Developer' }, 'search');
        return;
      }
      setLoginFeedbackState('error');
      setLoginFeedback('Terjadi kesalahan saat masuk. Coba lagi.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupFeedback('Semua isian wajib diisi.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupFeedback('Kata sandi minimal 6 karakter.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupFeedback('Kata sandi belum sama.');
      return;
    }

    try {
      const email = signupEmail.trim().toLowerCase();

      // Cek apakah email sudah terdaftar di database Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        setSignupFeedback('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung Masuk.');
        return;
      }

      // Hash kata sandi demi privasi dan keamanan di database
      const hashedPassword = await hashPassword(signupPassword);

      // Simpan akun ke tabel users di Supabase dengan role default 'developer'
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: signupName.trim(),
          email: email,
          password: hashedPassword,
          role: 'developer'
        }])
        .select();

      if (error) {
        console.error('Error insert user to Supabase:', error);
        throw error;
      }

      setSignupFeedback('Akun berhasil didaftarkan! Silakan masuk dengan email dan kata sandi Anda.');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      setSignupFeedback('Gagal mendaftar ke database. Pastikan tabel users sudah dibuat di Supabase.');
    }
  };

  const handleRecoveryRequest = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setRecoveryFeedback(
      `Instruksi demo siap untuk ${recoveryEmail.trim()}. Kode pratinjau: ${DEMO_RESET_CODE}. Tidak ada email yang dikirim.`
    );
    setRecoverySent(true);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (recoveryCode.trim().toUpperCase() !== DEMO_RESET_CODE && recoveryCode.trim().toUpperCase() !== 'GAMESCOPE-2024') {
      setRecoveryFeedback('Kode demo belum cocok.');
      return;
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setRecoveryFeedback('Kata sandi belum sama.');
      return;
    }

    setResetSuccess(true);
    setRecoveryFeedback('Kata sandi demo berhasil diatur ulang. Perubahan hanya berlaku untuk pratinjau ini.');
  };

  // If already logged in, show the rich Developer Profile View! (NO manual role switch)
  if (isLoggedIn) {
    return (
      <section className="py-8 max-w-4xl mx-auto" id="profile-view" aria-labelledby="profile-heading">
        {/* Profile Header */}
        <div className="bg-[#191c24] border border-[#2d303a] rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c7f36b] via-[#aa99ff] to-[#c7f36b]"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-1">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-lg border ${
                    role === 'admin'
                      ? 'bg-[#3b2a48] text-[#c7b7ff] border-[#553b6a]'
                      : 'bg-[#212c19] text-[#d7f7a6] border-[#445a2f]'
                  }`}
                >
                  {role === 'admin' ? 'A' : 'D'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#a8e858] border-2 border-[#191c24] rounded-full" title="Sesi aktif"></span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 id="profile-heading" className="font-display text-xl sm:text-2xl font-bold text-[#f4f3f8] m-0">
                    {userName || (role === 'admin' ? 'Administrator' : 'Developer (User)')}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                    role === 'admin'
                      ? 'bg-[#3b2a48] text-[#c7b7ff] border-[#553b6a]'
                      : 'bg-[#25301c] text-[#d7f7a6] border-[#445a2f]'
                  }`}>
                    {role === 'admin' ? 'Peran: Admin' : 'Peran: Developer (User)'}
                  </span>
                </div>
                <p className="text-xs text-[#9295a3] mt-1 mb-0">
                  {userEmail || (role === 'admin' ? 'admin@rekdev.id' : 'developer@rekdev.id')} &middot; Akun Terverifikasi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-[#2a1d22] hover:bg-[#3d242a] text-[#ff9da7] border border-[#522f36] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Icon name="log-out" width="14px" height="14px" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>

        {/* Hak Akses Sesuai Peran Email (Read-only, NO Switcher Buttons) */}
        <div className="bg-[#191c24] border border-[#2d303a] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707382]">OTORISASI AKUN</span>
              <h3 className="font-display text-base font-bold text-[#eeeef3] mt-0.5 mb-0">
                Hak Akses {role === 'admin' ? 'Administrator' : 'Developer (User)'}
              </h3>
            </div>
            <span className="text-[10px] text-[#9295a3] bg-[#14161d] px-2.5 py-1 rounded border border-[#2c2f39]">
              Email login: <b className="text-white">{userEmail || (role === 'admin' ? 'admin@rekdev.id' : 'developer@rekdev.id')}</b>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-[#171a22] border border-[#282b36] rounded-lg flex items-start gap-3">
              <span className="text-[#a8e858] mt-0.5">
                <Icon name="check" width="15px" height="15px" />
              </span>
              <div>
                <strong className="text-xs text-[#f4f3f8] block">Cari Game &amp; Similarity Engine</strong>
                <span className="text-[11px] text-[#9295a3]">Mencocokkan konsep game dengan data Steam.</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#171a22] border border-[#282b36] rounded-lg flex items-start gap-3">
              <span className="text-[#a8e858] mt-0.5">
                <Icon name="check" width="15px" height="15px" />
              </span>
              <div>
                <strong className="text-xs text-[#f4f3f8] block">Analisis Pasar &amp; Tren Genre</strong>
                <span className="text-[11px] text-[#9295a3]">Melihat perbandingan pasar dan estimasi pemilik.</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#171a22] border border-[#282b36] rounded-lg flex items-start gap-3">
              <span className="text-[#a8e858] mt-0.5">
                <Icon name="check" width="15px" height="15px" />
              </span>
              <div>
                <strong className="text-xs text-[#f4f3f8] block">Jelajah Katalog Game</strong>
                <span className="text-[11px] text-[#9295a3]">Mengeksplorasi referensi game Steam terpilih.</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-lg flex items-start gap-3 border ${
              role === 'admin'
                ? 'bg-[#231b2e] border-[#4b3564]'
                : 'bg-[#15171e] border-[#252833] opacity-60'
            }`}>
              <span className={role === 'admin' ? 'text-[#c7b7ff] mt-0.5' : 'text-[#707382] mt-0.5'}>
                <Icon name={role === 'admin' ? 'check' : 'lock'} width="15px" height="15px" />
              </span>
              <div>
                <strong className={`text-xs block ${role === 'admin' ? 'text-[#c7b7ff]' : 'text-[#858794]'}`}>
                  Kelola Data (CRUD Game)
                </strong>
                <span className="text-[11px] text-[#9295a3]">
                  {role === 'admin'
                    ? 'Akses penuh untuk menambah, mengedit, dan menghapus game di katalog.'
                    : 'Terkunci (Hanya tersedia untuk email admin@rekdev.id).'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#858794] mt-4 mb-0 flex items-center gap-1.5">
            <span>&bull;</span>
            <span>Peran akun ditentukan permanen dari email saat masuk. Untuk beralih ke peran lain, silakan klik tombol Keluar Sesi dan masuk kembali dengan email peran terkait.</span>
          </p>
        </div>

        {/* Studio Research Metrics & Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-[#191c24] border border-[#2d303a] rounded-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#29311e] text-[#c7f36b] flex items-center justify-center shrink-0">
              <Icon name="search" width="18px" height="18px" />
            </div>
            <div>
              <span className="text-[10px] text-[#858794] uppercase font-bold tracking-wider">Pencarian Ide</span>
              <strong className="block text-lg font-display text-[#f4f3f8]">3 Skenario</strong>
            </div>
          </div>

          <div className="p-4 bg-[#191c24] border border-[#2d303a] rounded-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#2b2640] text-[#c7b7ff] flex items-center justify-center shrink-0">
              <Icon name="compass" width="18px" height="18px" />
            </div>
            <div>
              <span className="text-[10px] text-[#858794] uppercase font-bold tracking-wider">Katalog Game</span>
              <strong className="block text-lg font-display text-[#f4f3f8]">6 Referensi</strong>
            </div>
          </div>

          <div className="p-4 bg-[#191c24] border border-[#2d303a] rounded-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#202b36] text-[#7fb6c0] flex items-center justify-center shrink-0">
              <Icon name="chart" width="18px" height="18px" />
            </div>
            <div>
              <span className="text-[10px] text-[#858794] uppercase font-bold tracking-wider">Dataset Steam</span>
              <strong className="block text-lg font-display text-[#f4f3f8]">2024 Terkini</strong>
            </div>
          </div>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="bg-[#191c24] border border-[#2d303a] rounded-xl p-5 mb-6">
          <h4 className="text-xs font-bold text-[#eeeef3] uppercase tracking-wider mb-3">Pintasan Ruang Riset</h4>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => navigateTo('search')}
              className="px-3.5 py-2 bg-[#22252e] hover:bg-[#2b303d] border border-[#30333d] rounded-lg text-xs text-[#f4f3f8] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Icon name="search" width="13px" height="13px" />
              <span>Cari Game Serupa</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="px-3.5 py-2 bg-[#22252e] hover:bg-[#2b303d] border border-[#30333d] rounded-lg text-xs text-[#f4f3f8] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Icon name="chart" width="13px" height="13px" />
              <span>Analisis Tren Pasar</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('library')}
              className="px-3.5 py-2 bg-[#22252e] hover:bg-[#2b303d] border border-[#30333d] rounded-lg text-xs text-[#f4f3f8] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Icon name="compass" width="13px" height="13px" />
              <span>Jelajah Katalog</span>
            </button>
            {role === 'admin' && (
              <button
                type="button"
                onClick={() => navigateTo('manage')}
                className="px-3.5 py-2 bg-[#2a243a] hover:bg-[#392e50] border border-[#483a65] text-[#c7b7ff] rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Icon name="database" width="13px" height="13px" />
                <span>Buka Panel Kelola Data</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-view" id="login-view" aria-labelledby="login-title">
      <div className="login-layout">
        <div className="login-welcome">
          <span className="brand-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="step-kicker">RUANG KREATIF</span>
          <h2>
            Riset dimulai
            <br />
            <em>dari sebuah ide.</em>
          </h2>
          <p>
            Masuk untuk kembali ke ruang kerja RekDev dan melanjutkan riset game indie-mu.
          </p>
          <div className="login-orbit" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <span>
              <Icon name="user" width="1em" height="1em" />
            </span>
          </div>
        </div>

        <div className="login-card">
          {activePanel === 'login' && (
            <div id="login-panel">
              <span className="step-kicker">SELAMAT DATANG KEMBALI</span>
              <h2 id="login-title">Masuk ke akun</h2>
              <p className="login-intro">Gunakan akun demo untuk melihat alur masuk.</p>

              {routeGuardFeedback && (
                <div
                  className="mb-4 p-3.5 bg-[#2b1f14] border border-[#68431f] rounded-lg text-[#ffd599] text-xs flex items-start gap-3 shadow-md"
                  id="route-guard-feedback"
                  role="alert"
                >
                  <span className="text-[#f59e0b] mt-0.5 shrink-0">
                    <Icon name="lock" width="16px" height="16px" />
                  </span>
                  <div className="flex-1 leading-relaxed">
                    <strong className="block text-[#fef3c7] font-semibold text-xs mb-0.5">Fitur Terkunci</strong>
                    <p className="m-0 text-[11px] text-[#fed7aa]">{routeGuardFeedback}</p>
                  </div>
                </div>
              )}

              <form id="login-form" className="login-form" onSubmit={handleLoginSubmit} noValidate>
                <label className="login-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="username"
                    placeholder="nama@email.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginFeedback('');
                    }}
                  />
                </label>

                <label className="login-field">
                  <span>Kata sandi</span>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginFeedback('');
                    }}
                  />
                </label>

                <div className="login-options">
                  <label>
                    <input type="checkbox" name="remember" /> Ingat saya
                  </label>
                  <button
                    className="text-action"
                    type="button"
                    id="show-recovery"
                    onClick={() => {
                      setActivePanel('recovery');
                      setRecoverySent(false);
                      setRecoveryFeedback('');
                      setResetSuccess(false);
                    }}
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                <button className="login-submit" type="submit">
                  Masuk{' '}
                  <span aria-hidden="true">
                    <Icon name="arrow-right" />
                  </span>
                </button>

                {loginFeedback && (
                  <p className="login-feedback" data-state={loginFeedbackState} role="status">
                    {loginFeedback}
                  </p>
                )}
              </form>

              <p className="login-switch">
                Belum punya akun?{' '}
                <button
                  type="button"
                  id="show-signup"
                  onClick={() => {
                    setActivePanel('signup');
                    setSignupFeedback('');
                  }}
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          )}

          {activePanel === 'signup' && (
            <div id="signup-panel">
              <span className="step-kicker">MULAI BERSAMA REKDEV</span>
              <h2 id="signup-title">Buat akun baru</h2>
              <p className="login-intro">Daftar untuk menyiapkan ruang riset game indie-mu.</p>

              <form id="signup-form" className="login-form" onSubmit={handleSignupSubmit} noValidate>
                <label className="login-field">
                  <span>Nama lengkap</span>
                  <input
                    type="text"
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Nama kamu"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      setSignupFeedback('');
                    }}
                  />
                </label>

                <label className="login-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupFeedback('');
                    }}
                  />
                </label>

                <label className="login-field">
                  <span>Kata sandi</span>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupFeedback('');
                    }}
                  />
                </label>

                <label className="login-field">
                  <span>Ulangi kata sandi</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={8}
                    placeholder="Masukkan lagi kata sandi"
                    value={signupConfirmPassword}
                    onChange={(e) => {
                      setSignupConfirmPassword(e.target.value);
                      setSignupFeedback('');
                    }}
                  />
                </label>

                <button className="login-submit" type="submit">
                  Buat akun{' '}
                  <span aria-hidden="true">
                    <Icon name="arrow-right" />
                  </span>
                </button>

                {signupFeedback && (
                  <p className="login-feedback" data-state="success" role="status">
                    {signupFeedback}
                  </p>
                )}
              </form>

              <p className="login-switch">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  id="show-login"
                  onClick={() => {
                    setActivePanel('login');
                    setLoginFeedback('');
                  }}
                >
                  Masuk
                </button>
              </p>
            </div>
          )}

          {activePanel === 'recovery' && (
            <div id="recovery-panel">
              <span className="step-kicker">PEMULIHAN AKUN</span>
              <h2 id="recovery-title">Atur ulang kata sandi</h2>
              <p className="login-intro">Masukkan email untuk melihat alur pemulihan akun demo.</p>

              {!recoverySent ? (
                <form
                  id="recovery-request-form"
                  className="login-form"
                  onSubmit={handleRecoveryRequest}
                  noValidate
                >
                  <label className="login-field">
                    <span>Email akun</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="nama@email.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                  </label>

                  <button className="login-submit" type="submit">
                    Kirim instruksi{' '}
                    <span aria-hidden="true">
                      <Icon name="arrow-right" />
                    </span>
                  </button>
                </form>
              ) : (
                <form
                  id="password-reset-form"
                  className="login-form reset-form"
                  onSubmit={handlePasswordReset}
                  noValidate
                >
                  <label className="login-field">
                    <span>Kode demo</span>
                    <input
                      type="text"
                      name="code"
                      required
                      placeholder="Masukkan kode demo"
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                    />
                  </label>

                  <label className="login-field">
                    <span>Kata sandi baru</span>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={8}
                      placeholder="Minimal 8 karakter"
                      value={recoveryNewPassword}
                      onChange={(e) => setRecoveryNewPassword(e.target.value)}
                    />
                  </label>

                  <label className="login-field">
                    <span>Ulangi kata sandi baru</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={8}
                      placeholder="Masukkan lagi kata sandi"
                      value={recoveryConfirmPassword}
                      onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                    />
                  </label>

                  <button className="login-submit" type="submit">
                    Simpan kata sandi{' '}
                    <span aria-hidden="true">
                      <Icon name="arrow-right" />
                    </span>
                  </button>
                </form>
              )}

              {recoveryFeedback && (
                <p
                  className="login-feedback"
                  data-state={resetSuccess || recoverySent ? 'success' : 'error'}
                  role="status"
                  style={{ marginTop: '10px' }}
                >
                  {recoveryFeedback}
                </p>
              )}

              <p className="login-switch">
                <button
                  type="button"
                  id="back-to-login"
                  onClick={() => {
                    setActivePanel('login');
                    setRouteGuardFeedback('');
                  }}
                >
                  <Icon name="arrow-left" /> Kembali ke masuk
                </button>
              </p>
            </div>
          )}

          <p className="login-disclaimer">
            Autentikasi belum terhubung. Form ini hanya menggunakan data tiruan lokal.
          </p>
        </div>
      </div>
    </section>
  );
}
