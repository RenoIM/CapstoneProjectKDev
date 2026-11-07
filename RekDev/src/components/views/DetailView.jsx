import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../Icons';

export function DetailView() {
  const { navigateTo, selectedGame, detailSource } = useApp();

  const isFromLibrary = detailSource === 'library';
  const backLabel = isFromLibrary ? 'Kembali ke Jelajah Game' : 'Kembali ke hasil';

  const handleBack = () => {
    navigateTo(isFromLibrary ? 'library' : 'results');
  };

  if (!selectedGame) {
    return (
      <section className="game-detail-view" id="game-detail-view" aria-labelledby="detail-title">
        <button
          type="button"
          className="edit-search-button back-results"
          id="back-to-results"
          onClick={handleBack}
        >
          <Icon name="arrow-left" /> <span>{backLabel}</span>
        </button>

        <div className="detail-not-found" id="detail-not-found" role="status">
          <span className="not-found-mark" aria-hidden="true">
            <Icon name="alert-triangle" />
          </span>
          <h2>Game tidak ditemukan</h2>
          <p>
            Detail game ini tidak tersedia. Game mungkin sudah dihapus dari katalog atau tautannya tidak lagi berlaku.
          </p>
        </div>
      </section>
    );
  }

  // Format fields based on source
  const scoreText = isFromLibrary ? selectedGame.price : `${selectedGame.score}%`;
  const scoreLabel = isFromLibrary ? 'harga acuan' : 'kemiripan dengan idemu';
  const ownersText = isFromLibrary
    ? `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(selectedGame.owners >= 1000000 ? selectedGame.owners / 1000000 : selectedGame.owners / 1000)} ${selectedGame.owners >= 1000000 ? 'jt' : 'rb'} pemilik (data demo)`
    : `${selectedGame.owners} (simulasi)`;

  const genreText = isFromLibrary
    ? (selectedGame.genreLabel || selectedGame.genre.toUpperCase())
    : selectedGame.genres.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ');

  const tagsList = isFromLibrary
    ? (selectedGame.tagLabels || selectedGame.tags)
    : (selectedGame.allTags || selectedGame.tags);

  const steamSearchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(selectedGame.title)}`;

  return (
    <section className="game-detail-view" id="game-detail-view" aria-labelledby="detail-title">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <button
          type="button"
          className="edit-search-button back-results"
          id="back-to-results"
          onClick={handleBack}
        >
          <Icon name="arrow-left" /> <span>{backLabel}</span>
        </button>

        <a
          href={steamSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#20251c] hover:bg-[#2b3520] border border-[#4c6036] hover:border-[#8bb647] rounded-md text-[#d7f7a6] text-[11px] font-semibold transition-all shadow-sm"
        >
          <span>Buka di Toko Steam</span>
          <Icon name="external-link" width="12px" height="12px" />
        </a>
      </div>

      <div className="detail-layout" id="detail-layout">
        {/* Cover Art Presentation Card */}
        <div
          className={`relative min-h-[340px] rounded-lg flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden border border-[#2d303a] shadow-inner ${selectedGame.artClass || 'game-art-one'}`}
          id="detail-art"
        >
          {/* Subtle concentric rings for game capsule aesthetic */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-56 h-56 rounded-full border border-white/20"></div>
            <div className="absolute w-72 h-72 rounded-full border border-white/10"></div>
          </div>

          {/* Top Genre Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 bg-[#151820]/80 backdrop-blur-md border border-white/10 rounded text-[9px] font-semibold text-[#e4e4eb] tracking-wide">
            {isFromLibrary ? (selectedGame.genreLabel || selectedGame.genre) : selectedGame.mode || 'STEAM GAME'}
          </div>

          {/* Steam Capsule Identifier */}
          <div className="absolute top-3.5 right-3.5 z-10 px-2 py-0.5 bg-black/40 backdrop-blur border border-white/5 rounded text-[8px] text-[#9a9ca8]">
            STEAM #{selectedGame.id}
          </div>

          {/* Centered Art Icon */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#f4f3f8] mb-3.5 shadow-xl">
            <Icon name={selectedGame.artIcon || 'sparkle'} width="38px" height="38px" />
          </div>

          {/* Stylized Typography */}
          <h3 className="relative z-10 font-display font-bold text-lg tracking-wider text-white/95 uppercase m-0 leading-tight drop-shadow-md">
            {selectedGame.artText ? selectedGame.artText.replace('\n', ' ') : selectedGame.title}
          </h3>

          <span className="relative z-10 text-[9px] text-white/70 tracking-widest mt-1 uppercase font-medium">
            {selectedGame.developer || 'Indie Game Reference'}
          </span>
        </div>

        {/* Game Information & Metrics */}
        <div className="detail-copy">
          <div className="flex items-center gap-2 mb-1">
            <span className="step-kicker">
              DETAIL RISET <span className="demo-pill">DATA REFERENSI</span>
            </span>
          </div>

          <h2 id="detail-title">{selectedGame.title}</h2>

          <div className="detail-match">
            <span className="match-score">
              <strong id="detail-score">{scoreText}</strong>
              <span id="detail-score-label">{scoreLabel}</span>
            </span>
            <p id="detail-description">{selectedGame.description}</p>
          </div>

          <div className="detail-tags" id="detail-tags">
            {tagsList.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          {/* Meaningful Market Research Fact Cards */}
          <dl className="detail-facts">
            <div>
              <dt>Genre Utama</dt>
              <dd id="detail-genres">{genreText}</dd>
            </div>
            <div>
              <dt>Estimasi Pemilik</dt>
              <dd id="detail-owners">{ownersText}</dd>
            </div>
            <div>
              <dt>Developer & Studio</dt>
              <dd>{selectedGame.developer || 'RekDev Demo Studio'}</dd>
            </div>
            <div>
              <dt>Ulasan Steam</dt>
              <dd className="text-[#a8e858] font-medium flex items-center gap-1.5">
                <Icon name="star" width="12px" height="12px" />
                <span>{selectedGame.reviews || 'Sangat Positif (91% positif)'}</span>
              </dd>
            </div>
            <div>
              <dt>Tahun & Status Rilis</dt>
              <dd>{selectedGame.year ? `${selectedGame.year} · Rilis Penuh` : '2023 · Rilis Penuh'}</dd>
            </div>
            <div>
              <dt>Platform Dukungan</dt>
              <dd>PC (Windows, macOS, Steam Deck)</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="detail-disclaimer" id="detail-disclaimer">
        Data pasar disimulasikan dari benchmark publik Steam sebagai bahan analisis &amp; validasi ide game indie.
      </p>
    </section>
  );
}

