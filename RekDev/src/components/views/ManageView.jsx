import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HISTORY_ACTIVITIES } from '../../constants/data';
import { AddEditGameModal } from '../modals/AddEditGameModal';
import { DeleteGameModal } from '../modals/DeleteGameModal';
import { Icon } from '../Icons';

export function ManageView() {
  const { games, addGame, updateGame, deleteGame, updateLogs, isLoadingGames } = useApp();

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingGame, setDeletingGame] = useState(null);

  // CSV Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('Belum ada file yang dipilih.');
  const [uploadState, setUploadState] = useState(''); // 'ready' | 'error' | ''

  // History Filter
  const [historyPeriod, setHistoryPeriod] = useState('30');

  const filteredHistory = useMemo(() => {
    if (updateLogs && updateLogs.length > 0) {
      return updateLogs.map((log) => ({
        id: log.id,
        title: log.notes || log.action,
        type: log.action && (log.action.includes('INSERT') || log.action.includes('IMPORT') || log.action.includes('SEED')) ? 'import' : 'edit',
        meta: `${log.admin_id || 'admin@rekdev.id'} · ${log.action}`,
        date: log.created_at ? log.created_at.split('T')[0] : '',
        dateFormatted: log.created_at
          ? new Date(log.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Baru saja'
      }));
    }

    if (historyPeriod === 'all') return HISTORY_ACTIVITIES;
    const days = Number(historyPeriod);
    const now = new Date('2026-10-16T00:00:00'); // current simulated time
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);

    return HISTORY_ACTIVITIES.filter((row) => {
      const rowDate = new Date(`${row.date}T00:00:00`);
      return rowDate >= cutoff && rowDate <= now;
    });
  }, [updateLogs, historyPeriod]);

  const handleEditClick = (game) => {
    setEditingGame(game);
    setIsAddEditOpen(true);
  };

  const handleAddClick = () => {
    setEditingGame(null);
    setIsAddEditOpen(true);
  };

  const handleDeleteClick = (game) => {
    setDeletingGame(game);
    setIsDeleteOpen(true);
  };

  const handleFile = (file) => {
    if (!file) return;
    const isCsv =
      file.name.toLowerCase().endsWith('.csv') &&
      (!file.type || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel');

    if (!isCsv) {
      setUploadFeedback('Pilih berkas berformat CSV.');
      setUploadState('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadFeedback('Ukuran berkas melebihi batas 10 MB.');
      setUploadState('error');
      return;
    }

    const sizeLabel =
      file.size < 1024 * 1024
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(file.size / (1024 * 1024))} MB`;

    setUploadFeedback(`${file.name} · ${sizeLabel} · dipilih untuk pratinjau; belum diunggah ke database.`);
    setUploadState('ready');
  };

  return (
    <section className="manage-view" id="manage-data-view" aria-labelledby="manage-title">
      <div className="manage-heading">
        <div>
          <span className="step-kicker">
            ADMINISTRASI <span className="demo-pill" style={{ background: '#25351e', color: '#c7f36b', border: '1px solid #3d592a' }}>SUPABASE LIVE</span>
          </span>
          <h2 id="manage-title">Kelola data game</h2>
          <p>Pantau katalog yang menjadi sumber rekomendasi dan analisis pasar.</p>
        </div>
        <div className="manage-heading-actions">
          <span className="manage-status" style={{ color: '#c7f36b' }}>
            <i style={{ background: '#c7f36b' }}></i> Database Supabase Terhubung
          </span>
          <button type="button" className="add-game-button" onClick={handleAddClick}>
            + Tambah game
          </button>
        </div>
      </div>

      <div className="manage-stats">
        <article>
          <span>Total game</span>
          <strong>{games.length}</strong>
          <small>tersimpan di Supabase</small>
        </article>
        <article>
          <span>Data pemilik</span>
          <strong>
            {games.length} <small>/ {games.length}</small>
          </strong>
          <small>game memiliki estimasi</small>
        </article>
        <article>
          <span>Sumber data</span>
          <strong>Cloud</strong>
          <small>Supabase PostgreSQL</small>
        </article>
      </div>

      <section className="quality-panel" aria-labelledby="quality-title">
        <div className="quality-heading">
          <div>
            <span className="panel-eyebrow">PEMERIKSAAN DATA</span>
            <h3 id="quality-title">Kualitas katalog</h3>
          </div>
          <span className="quality-status">
            <i></i> Perlu ditinjau
          </span>
        </div>
        <p className="quality-summary">
          <strong>5 dari 6</strong> pemeriksaan terpenuhi. Satu entri demo perlu dilengkapi.
        </p>
        <div className="quality-checks">
          <div className="quality-check">
            <span className="quality-check-icon pass">
              <Icon name="check" />
            </span>
            <span>
              <strong>Nama dan genre wajib</strong>
              <small>Semua entri memiliki nama dan genre</small>
            </span>
            <b>6/6</b>
          </div>

          <div className="quality-check">
            <span className="quality-check-icon pass">
              <Icon name="check" />
            </span>
            <span>
              <strong>Estimasi jumlah pemilik</strong>
              <small>Rentang estimasi tersedia</small>
            </span>
            <b>6/6</b>
          </div>

          <div className="quality-check">
            <span className="quality-check-icon pass">
              <Icon name="check" />
            </span>
            <span>
              <strong>App ID tidak duplikat</strong>
              <small>Semua ID unik di katalog demo</small>
            </span>
            <b>6/6</b>
          </div>

          <div className="quality-check quality-check-warning">
            <span className="quality-check-icon warn">!</span>
            <span>
              <strong>Tag gameplay</strong>
              <small>1 entri belum memiliki tag terstandar</small>
            </span>
            <b>5/6</b>
          </div>
        </div>
        <p className="quality-disclaimer">
          Hasil pemeriksaan ini adalah data demo untuk pratinjau antarmuka.
        </p>
      </section>

      <section className="manage-table-panel" aria-labelledby="manage-table-title">
        <div className="manage-table-heading">
          <div>
            <span className="panel-eyebrow">KATALOG GAME</span>
            <h3 id="manage-table-title">Daftar data</h3>
          </div>
          <span className="table-count">{games.length} entri</span>
        </div>

        <div className="table-scroll">
          <table className="games-table">
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">App ID</th>
                <th scope="col">Genre</th>
                <th scope="col">Estimasi pemilik</th>
                <th scope="col">Tanggal rilis</th>
                <th scope="col">Sumber</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.id}>
                  <td>
                    <span className="table-game">
                      <i className={`table-art ${g.artColor}`}>{g.artInitial}</i>
                      <span>
                        <strong>{g.name}</strong>
                        <small>{g.developer}</small>
                      </span>
                    </span>
                  </td>
                  <td>{g.appId}</td>
                  <td>
                    <span className="table-genre">{g.genre}</span>
                  </td>
                  <td>{g.owners}</td>
                  <td>{g.release_date || g.releaseDate || g.releaseYear || '-'}</td>
                  <td>
                    <span className="source-badge">{g.source || 'Supabase'}</span>
                  </td>
                  <td>
                    <span className="table-actions">
                      <button
                        type="button"
                        className="row-action"
                        onClick={() => handleEditClick(g)}
                        aria-label={`Ubah ${g.name}`}
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        className="row-action delete-row-action"
                        onClick={() => handleDeleteClick(g)}
                        aria-label={`Hapus ${g.name}`}
                      >
                        Hapus
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="manage-disclaimer">
          Seluruh baris adalah data tiruan untuk pratinjau. Nilai App ID dan estimasi pemilik bukan data Steam aktual.
        </p>
      </section>

      <section className="upload-panel" aria-labelledby="upload-title">
        <div className="manage-table-heading">
          <div>
            <span className="panel-eyebrow">IMPOR DATA</span>
            <h3 id="upload-title">Unggah dataset game</h3>
          </div>
          <span className="table-count">CSV</span>
        </div>

        <div className="upload-content">
          <label
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            htmlFor="steam-csv-file"
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              handleFile(file);
            }}
          >
            <input
              id="steam-csv-file"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span className="upload-icon" aria-hidden="true">
              <Icon name="upload" />
            </span>
            <strong>Seret file CSV ke sini</strong>
            <span>
              atau <u>pilih file dari perangkat</u>
            </span>
          </label>

          <p className="upload-guidance">
            Format CSV &middot; Maksimal 10 MB &middot; Gunakan kolom dataset Steam yang didukung.
          </p>
          <p
            className="upload-feedback"
            id="upload-feedback"
            role="status"
            aria-live="polite"
            data-state={uploadState}
          >
            {uploadFeedback}
          </p>
        </div>
      </section>

      <section className="history-panel" aria-labelledby="history-title">
        <div className="manage-table-heading">
          <div>
            <span className="panel-eyebrow">AKTIVITAS</span>
            <h3 id="history-title">Riwayat pembaruan</h3>
          </div>
          <label className="history-filter">
            <span className="sr-only">Filter rentang waktu</span>
            <select
              id="history-period"
              value={historyPeriod}
              onChange={(e) => setHistoryPeriod(e.target.value)}
            >
              <option value="7">7 hari terakhir</option>
              <option value="30">30 hari terakhir</option>
              <option value="90">90 hari terakhir</option>
              <option value="all">Semua waktu</option>
            </select>
          </label>
        </div>

        <div className="history-list" id="history-list">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <article key={item.id} className="history-row" data-history-date={item.date}>
                <span
                  className={`history-icon ${item.type === 'edit' ? 'history-edit' : 'history-import'}`}
                >
                  <Icon name={item.type === 'edit' ? 'edit' : 'import'} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.meta.split('·')[0]} <i>&middot;</i> {item.meta.split('·')[1]}
                  </p>
                </div>
                <time dateTime={item.date}>{item.dateFormatted}</time>
              </article>
            ))
          ) : (
            <p className="history-empty" id="history-empty">
              Tidak ada pembaruan pada rentang waktu ini.
            </p>
          )}
        </div>

        <p className="history-disclaimer">
          Riwayat ini disinkronkan langsung dengan tabel update_logs di Supabase.
        </p>
      </section>

      <AddEditGameModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        editingGame={editingGame}
        onSave={(savedGame) => {
          if (editingGame) {
            updateGame(savedGame);
          } else {
            addGame(savedGame);
          }
        }}
      />

      <DeleteGameModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        game={deletingGame}
        onConfirm={(id) => deleteGame(id, deletingGame?.name)}
      />
    </section>
  );
}
