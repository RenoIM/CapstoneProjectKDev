import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MANAGE_GAMES } from '../constants/data';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const mapFromSupabase = (row) => {
  const gList = Array.isArray(row.genres) && row.genres.length > 0 ? row.genres : [row.genre || 'Simulation'];
  const firstGenre = gList[0] || 'Simulation';
  const colors = ['art-green', 'art-blue', 'art-amber', 'art-purple', 'art-sand'];
  const colorIndex = (typeof row.id === 'number' ? row.id : 1) % colors.length;

  return {
    id: row.id,
    appId: row.app_id || row.id?.toString(),
    app_id: row.app_id,
    name: row.name,
    title: row.name,
    genre: firstGenre,
    genres: gList,
    tags: Array.isArray(row.tags) ? row.tags : [],
    description: row.description || '',
    developer: row.developer || 'RekDev Studio',
    releaseDate: row.release_date || '',
    release_date: row.release_date || '',
    releaseYear: row.release_date ? row.release_date.substring(0, 4) : '2024',
    price: Number(row.price) || 0,
    owners: row.owners || (row.owners_estimated ? `${Math.round(row.owners_estimated / 1000)} rb` : '0 rb'),
    ownersNum: Number(row.owners_estimated) || 0,
    ownersEstimated: Number(row.owners_estimated) || 0,
    positiveRating: row.positive_rating || 90,
    score: row.positive_rating || 90,
    source: 'Supabase',
    artColor: colors[colorIndex],
    artInitial: (row.name || 'G').trim().charAt(0).toUpperCase()
  };
};

export function AppProvider({ children }) {
  // Navigation - default to 'account' for unauthenticated visitors
  const [currentView, setCurrentView] = useState('account');
  const [detailSource, setDetailSource] = useState('results');
  const [selectedGame, setSelectedGame] = useState(null);

  // Search State
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState('');
  const [searchSummary, setSearchSummary] = useState('');

  // Session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('developer'); // 'developer' | 'admin'
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [routeGuardFeedback, setRouteGuardFeedback] = useState('');

  // Manage Data State
  const [games, setGames] = useState(INITIAL_MANAGE_GAMES);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [updateLogs, setUpdateLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Fetch games from Supabase
  const fetchGames = async () => {
    try {
      setIsLoadingGames(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching games from Supabase:', error);
        return;
      }

      if (data && data.length > 0) {
        setGames(data.map(mapFromSupabase));
      }
    } catch (err) {
      console.error('Unexpected error loading games:', err);
    } finally {
      setIsLoadingGames(false);
    }
  };

  // Fetch update_logs from Supabase
  const fetchLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const { data, error } = await supabase
        .from('update_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching logs from Supabase:', error);
        return;
      }

      if (data) {
        setUpdateLogs(data);
      }
    } catch (err) {
      console.error('Unexpected error loading logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchLogs();
  }, []);

  const navigateTo = (view, options = {}) => {
    // Route guard: Cari game, Hasil, dan Analisis pasar wajib login
    if ((view === 'search' || view === 'results' || view === 'dashboard') && !isLoggedIn) {
      setCurrentView('account');
      const featureName = view === 'dashboard' ? 'Analisis Pasar' : 'Cari Game';
      setRouteGuardFeedback(
        `Fitur ${featureName} dikunci. Silakan masuk terlebih dahulu dengan email Developer atau Admin.`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Route guard: Kelola data wajib admin
    if (view === 'manage' && (!isLoggedIn || role !== 'admin')) {
      setCurrentView('account');
      setRouteGuardFeedback(
        isLoggedIn
          ? 'Halaman Kelola data hanya dapat diakses dengan akun berlisensi Admin (admin@rekdev.id).'
          : 'Silakan masuk dengan akun Admin (admin@rekdev.id) untuk membuka halaman Kelola data.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setRouteGuardFeedback('');
    if (options.game) {
      setSelectedGame(options.game);
    }
    if (options.source) {
      setDetailSource(options.source);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (roleOrUser = 'developer', redirectTo = null) => {
    setIsLoggedIn(true);
    if (typeof roleOrUser === 'object') {
      const assignedRole = roleOrUser.role || 'developer';
      setRole(assignedRole);
      setUserEmail(roleOrUser.email || (assignedRole === 'admin' ? 'admin@rekdev.id' : 'developer@rekdev.id'));
      setUserName(roleOrUser.name || (assignedRole === 'admin' ? 'Administrator' : 'Developer'));
    } else {
      setRole(roleOrUser);
      setUserEmail(roleOrUser === 'admin' ? 'admin@rekdev.id' : 'developer@rekdev.id');
      setUserName(roleOrUser === 'admin' ? 'Administrator' : 'Developer');
    }
    setRouteGuardFeedback('');
    if (redirectTo) {
      setCurrentView(redirectTo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole('developer');
    setUserEmail('');
    setUserName('');
    setCurrentView('account');
    setRouteGuardFeedback('Sesi Anda telah berakhir. Silakan masuk untuk mengakses Cari Game dan Analisis Pasar.');
  };

  const addGame = async (newGame) => {
    try {
      const genreArray = Array.isArray(newGame.genres) && newGame.genres.length > 0
        ? newGame.genres
        : [newGame.genre || 'Action'];

      const dbPayload = {
        name: newGame.name,
        app_id: newGame.appId || Math.floor(1000000 + Math.random() * 9000000).toString(),
        genres: genreArray,
        tags: newGame.tags || ['Singleplayer'],
        description: newGame.description || '',
        developer: newGame.developer || 'RekDev Studio',
        release_date: newGame.releaseDate || newGame.release_date || new Date().toISOString().split('T')[0],
        price: Number(newGame.price) || 0,
        owners: newGame.owners || '0–10 rb',
        owners_estimated: Number(newGame.ownersEstimated) || 0,
        positive_rating: Number(newGame.positiveRating) || 90
      };

      const { data, error } = await supabase
        .from('games')
        .insert([dbPayload])
        .select();

      if (error) {
        console.error('Gagal menyimpan game ke Supabase:', error);
        throw error;
      }

      // Catat ke update_logs
      await supabase.from('update_logs').insert([{
        admin_id: userEmail || 'admin@rekdev.id',
        action: 'INSERT_GAME',
        affected_count: 1,
        notes: `Menambahkan game baru: ${newGame.name}`
      }]);

      await fetchGames();
      await fetchLogs();
      return { success: true, data };
    } catch (err) {
      console.error('Error addGame:', err);
      // Fallback lokal jika ada gangguan
      setGames(prev => [newGame, ...prev]);
      return { success: false, error: err };
    }
  };

  const updateGame = async (updatedGame) => {
    try {
      const genreArray = Array.isArray(updatedGame.genres) && updatedGame.genres.length > 0
        ? updatedGame.genres
        : [updatedGame.genre || 'Action'];

      const dbPayload = {
        name: updatedGame.name,
        genres: genreArray,
        description: updatedGame.description || '',
        developer: updatedGame.developer || 'RekDev Studio',
        release_date: updatedGame.releaseDate || updatedGame.release_date || undefined,
        price: Number(updatedGame.price) || 0,
        owners: updatedGame.owners || '0–10 rb',
        owners_estimated: Number(updatedGame.ownersEstimated) || 0
      };

      const { data, error } = await supabase
        .from('games')
        .update(dbPayload)
        .eq('id', updatedGame.id)
        .select();

      if (error) {
        console.error('Gagal update game di Supabase:', error);
        throw error;
      }

      // Catat ke update_logs
      await supabase.from('update_logs').insert([{
        admin_id: userEmail || 'admin@rekdev.id',
        action: 'UPDATE_GAME',
        affected_count: 1,
        notes: `Memperbarui data game: ${updatedGame.name}`
      }]);

      await fetchGames();
      await fetchLogs();
      return { success: true, data };
    } catch (err) {
      console.error('Error updateGame:', err);
      setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
      return { success: false, error: err };
    }
  };

  const deleteGame = async (id, gameName = '') => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Gagal menghapus game dari Supabase:', error);
        throw error;
      }

      // Catat ke update_logs
      await supabase.from('update_logs').insert([{
        admin_id: userEmail || 'admin@rekdev.id',
        action: 'DELETE_GAME',
        affected_count: 1,
        notes: `Menghapus game ${gameName ? `"${gameName}" ` : ''}(ID: ${id})`
      }]);

      await fetchGames();
      await fetchLogs();
      return { success: true };
    } catch (err) {
      console.error('Error deleteGame:', err);
      setGames(prev => prev.filter(g => g.id !== id));
      return { success: false, error: err };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        detailSource,
        selectedGame,
        setSelectedGame,
        selectedGenres,
        setSelectedGenres,
        selectedTags,
        setSelectedTags,
        description,
        setDescription,
        searchSummary,
        setSearchSummary,
        isLoggedIn,
        role,
        setRole,
        userEmail,
        userName,
        login,
        logout,
        routeGuardFeedback,
        setRouteGuardFeedback,
        games,
        isLoadingGames,
        updateLogs,
        isLoadingLogs,
        fetchGames,
        fetchLogs,
        addGame,
        updateGame,
        deleteGame
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
