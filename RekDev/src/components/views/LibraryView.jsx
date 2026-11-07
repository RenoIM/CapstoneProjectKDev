import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATALOG_GAMES } from '../../constants/data';
import { Icon } from '../Icons';

export function LibraryView() {
  const { navigateTo, games } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const artClasses = ['catalog-art-one', 'catalog-art-two', 'catalog-art-three', 'catalog-art-four', 'catalog-art-five', 'catalog-art-six'];
  const artIcons = ['box', 'flame', 'compass', 'layers', 'shield', 'puzzle', 'ghost', 'coffee'];

  const sourceList = useMemo(() => {
    if (games && games.length > 0) {
      return games.map((g, idx) => {
        const rawTags = Array.isArray(g.tags) && g.tags.length > 0 ? g.tags : ['Singleplayer'];
        const tagSlugs = rawTags.map(t => String(t).toLowerCase().replace(/\s+/g, '-'));
        const genreStr = (g.genre || (Array.isArray(g.genres) && g.genres.length > 0 ? g.genres[0] : 'Simulation') || 'Simulation').toString();
        const genreSlug = genreStr.toLowerCase();
        const numOwners = Number(g.ownersEstimated) || Number(g.ownersNum) || 100000;
        const releaseY = g.release_date ? parseInt(g.release_date.substring(0, 4), 10) : (parseInt(g.releaseYear, 10) || 2024);
        const priceDisplay = g.price ? (typeof g.price === 'number' ? `$${g.price}` : g.price) : 'Gratis';

        return {
          id: g.id,
          title: g.name || g.title || 'Untitled Game',
          name: g.name || g.title || 'Untitled Game',
          genre: genreSlug,
          genreLabel: genreStr,
          genres: Array.isArray(g.genres) ? g.genres : [genreStr],
          tags: tagSlugs,
          tagLabels: rawTags,
          price: priceDisplay,
          owners: numOwners,
          year: releaseY,
          release_date: g.release_date,
          developer: g.developer || 'RekDev Studio',
          artClass: artClasses[idx % artClasses.length],
          artIcon: artIcons[idx % artIcons.length],
          artText: (g.name || g.title || 'GAME').toUpperCase().slice(0, 15),
          description: g.description || 'Tidak ada deskripsi.'
        };
      });
    }
    return CATALOG_GAMES;
  }, [games]);

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sourceList.filter((game) => {
      const matchesQuery = (game.title || '').toLowerCase().includes(q);
      const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre.toLowerCase();
      const matchesTag = selectedTag === 'all' || (Array.isArray(game.tags) && game.tags.includes(selectedTag.toLowerCase()));
      return matchesQuery && matchesGenre && matchesTag;
    });
  }, [searchQuery, selectedGenre, selectedTag, sourceList]);

  const handleShowDetail = (game) => {
    navigateTo('detail', { game, source: 'library' });
  };

  const formatOwners = (count) => {
    if (count >= 1000000) {
      return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(count / 1000000)} jt`;
    }
    if (count >= 1000) {
      return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(count / 1000)} rb`;
    }
    return count.toString();
  };

  return (
    <section className="library-view" id="library-view" aria-labelledby="library-title">
      <div className="library-heading">
        <div>
          <span className="step-kicker">
            KATALOG <span className="demo-pill">DATA DEMO</span>
          </span>
          <h2 id="library-title">Jelajahi game</h2>
          <p>Kenali game yang sudah ada dan temukan inspirasi untuk ide berikutnya.</p>
        </div>
      </div>

      <div className="catalog-toolbar">
        <label className="catalog-search" htmlFor="game-search">
          <span aria-hidden="true">
            <Icon name="search" />
          </span>
          <input
            id="game-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama game..."
            autoComplete="off"
          />
        </label>

        <label className="catalog-filter">
          <span className="sr-only">Saring genre</span>
          <select
            id="catalog-genre-filter"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">Semua genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="rpg">RPG</option>
            <option value="strategy">Strategy</option>
            <option value="simulation">Simulation</option>
            <option value="horror">Horror</option>
          </select>
        </label>

        <label className="catalog-filter">
          <span className="sr-only">Saring tag</span>
          <select
            id="catalog-tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="all">Semua tag</option>
            <option value="cozy">Cozy</option>
            <option value="crafting">Crafting</option>
            <option value="story-rich">Story Rich</option>
            <option value="fantasy">Fantasy</option>
            <option value="choices-matter">Choices Matter</option>
            <option value="exploration">Exploration</option>
            <option value="underwater">Underwater</option>
            <option value="mystery">Mystery</option>
            <option value="singleplayer">Singleplayer</option>
            <option value="base-building">Base Building</option>
            <option value="survival">Survival</option>
            <option value="resource">Resource</option>
            <option value="arcade">Arcade</option>
            <option value="racing">Racing</option>
            <option value="score-attack">Score Attack</option>
            <option value="psychological">Psychological</option>
            <option value="atmospheric">Atmospheric</option>
            <option value="investigation">Investigation</option>
          </select>
        </label>

        <p className="catalog-count" id="catalog-count" aria-live="polite">
          <strong>{filteredGames.length}</strong> game contoh
        </p>
      </div>

      {filteredGames.length > 0 ? (
        <div className="catalog-grid" id="catalog-grid" aria-label="Daftar game contoh">
          {filteredGames.map((game) => (
            <article
              key={game.id}
              className="catalog-card"
              data-genre={game.genre}
              data-tags={(game.tags || []).join(' ')}
            >
              <div className={`catalog-art ${game.artClass || 'catalog-art-one'}`}>
                <span aria-hidden="true">
                  <Icon name={game.artIcon || 'box'} width="1em" height="1em" />
                </span>
                <small style={{ whiteSpace: 'pre-line' }}>{game.artText || game.title}</small>
                <span className="catalog-genre">{game.genreLabel || game.genre}</span>
              </div>

              <div className="catalog-copy">
                <div className="catalog-title">
                  <h3>{game.title}</h3>
                  <span className="catalog-price">{game.price}</span>
                </div>

                <p>{game.description}</p>

                <div className="catalog-tags">
                  {(game.tagLabels || game.tags || []).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="catalog-meta">
                  <span>
                    <i>
                      <Icon name="users" />
                    </i>{' '}
                    <span className="owner-count" data-owner-count={game.owners}>
                      {formatOwners(Number(game.owners) || 0)}
                    </span>{' '}
                    pemilik
                  </span>
                  <span>{game.year || '-'}</span>
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
        <p className="catalog-empty" id="catalog-empty">
          Tidak ada game dengan nama tersebut. Coba kata kunci lain.
        </p>
      )}

      <p className="catalog-disclaimer">
        Judul, harga, tag, dan estimasi pemilik pada katalog ini adalah data contoh untuk pratinjau antarmuka.
      </p>
    </section>
  );
}
