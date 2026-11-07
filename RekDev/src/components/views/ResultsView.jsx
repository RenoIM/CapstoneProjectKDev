import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_RESULTS } from '../../constants/data';
import { Icon } from '../Icons';

export function ResultsView() {
  const { navigateTo, searchSummary, selectedGenres } = useApp();

  const [genreFilter, setGenreFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [sortBy, setSortBy] = useState('score');

  const filteredAndSortedResults = useMemo(() => {
    let list = MOCK_RESULTS.filter((game) => {
      const matchesGenre = genreFilter === 'all' || game.genres.includes(genreFilter);
      const matchesScore = game.score >= scoreFilter;
      return matchesGenre && matchesScore;
    });

    return list.sort((a, b) => {
      if (sortBy === 'owners-desc') return b.ownersNum - a.ownersNum;
      if (sortBy === 'owners-asc') return a.ownersNum - b.ownersNum;
      return b.score - a.score;
    });
  }, [genreFilter, scoreFilter, sortBy]);

  const handleShowDetail = (game) => {
    navigateTo('detail', { game, source: 'results' });
  };

  return (
    <section className="results-view" id="results-view" aria-labelledby="results-title">
      <div className="results-topline">
        <div>
          <span className="step-kicker">
            HASIL PENCARIAN <span className="demo-pill">DATA CONTOH</span>
          </span>
          <h2 id="results-title">Game yang sejalan dengan idemu</h2>
          <p>Jelajahi game dengan karakteristik serupa sebagai titik awal risetmu.</p>
        </div>
        <button
          type="button"
          className="edit-search-button"
          id="edit-search"
          onClick={() => navigateTo('search')}
        >
          <Icon name="edit" /> <span>Ubah pencarian</span>
        </button>
      </div>

      <div className="query-summary">
        <span className="summary-icon">
          <Icon name="sparkle" />
        </span>
        <div>
          <strong>Ide yang kamu cari</strong>
          <p id="query-summary-text">{searchSummary || 'Simulation · Adventure · “Game cozy kebun luar angkasa”'}</p>
        </div>
      </div>

      <div className="results-toolbar">
        <div>
          <strong id="result-count">{filteredAndSortedResults.length} game ditemukan</strong>
          <span> &middot; sesuai filter</span>
        </div>
        <span className="mock-note">Skor dan data pemilik adalah simulasi</span>
      </div>

      <div className="result-controls" aria-label="Filter dan urutkan hasil">
        <label>
          <span>Genre</span>
          <select
            id="result-genre-filter"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="all">Semua genre</option>
            <option value="adventure">Adventure</option>
            <option value="simulation">Simulation</option>
            <option value="strategy">Strategy</option>
            <option value="puzzle">Puzzle</option>
          </select>
        </label>

        <label>
          <span>Skor minimal</span>
          <select
            id="result-score-filter"
            value={scoreFilter}
            onChange={(e) => setScoreFilter(Number(e.target.value))}
          >
            <option value="0">Semua skor</option>
            <option value="85">85% ke atas</option>
            <option value="90">90% ke atas</option>
          </select>
        </label>

        <label>
          <span>Urutkan</span>
          <select
            id="result-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score">Kemiripan tertinggi</option>
            <option value="owners-desc">Pemilik terbanyak</option>
            <option value="owners-asc">Pemilik paling sedikit</option>
          </select>
        </label>
      </div>

      {filteredAndSortedResults.length > 0 ? (
        <div className="game-results">
          {filteredAndSortedResults.map((game) => (
            <article
              key={game.id}
              className="game-result-card"
              data-genres={game.genres.join(',')}
              data-score={game.score}
              data-owners={game.ownersNum}
            >
              <div className={`game-art ${game.artClass}`}>
                <span>
                  <Icon name={game.artIcon} width="1em" height="1em" />
                </span>
                <small style={{ whiteSpace: 'pre-line' }}>{game.artText}</small>
              </div>

              <div className="game-result-info">
                <div className="game-result-title">
                  <div>
                    <span className="match-label">{game.label}</span>
                    <h3>{game.title}</h3>
                  </div>
                  <div className="match-score">
                    <strong>{game.score}%</strong>
                    <span>kemiripan</span>
                  </div>
                </div>

                <div
                  className="match-progress"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={game.score}
                  aria-label={`Nilai kemiripan ${game.score}%`}
                >
                  <span
                    style={{ width: `${game.score}%` }}
                    aria-hidden="true"
                  ></span>
                </div>

                <p className="game-description">{game.description}</p>

                <div className="result-tags" aria-label="Ringkasan genre dan tag">
                  <div className="taxonomy-row">
                    <span className="taxonomy-label">GENRE</span>
                    <div className="taxonomy-terms">
                      {game.genres.map((g) => (
                        <span key={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                      ))}
                    </div>
                  </div>
                  <div className="taxonomy-row">
                    <span className="taxonomy-label">TAG</span>
                    <div className="taxonomy-terms">
                      {game.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="game-meta">
                  <span>
                    <Icon name="users" /> <b>{game.owners}</b> estimasi pemilik
                  </span>
                  <span>
                    <Icon name="user" /> {game.mode}
                  </span>
                </div>

                <button
                  type="button"
                  className="detail-button"
                  onClick={() => handleShowDetail(game)}
                  aria-label={`Lihat detail ${game.title}`}
                >
                  Lihat detail &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-results" id="empty-results">
          Tidak ada game yang cocok dengan filter ini. Coba ubah genre atau skor minimal.
        </p>
      )}
    </section>
  );
}
