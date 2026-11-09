import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GENRES, TAGS, EXAMPLE_IDEAS } from '../../constants/data';
import { Icon } from '../Icons';
import { supabase } from '../../lib/supabase';

const GENRE_LIMIT = 6;
const TAG_LIMIT = 6;
const MAX_GENRES = 5;
const MAX_TAGS = 5;

export function SearchView() {
  const {
    navigateTo,
    selectedGenres,
    setSelectedGenres,
    selectedTags,
    setSelectedTags,
    description,
    setDescription,
    setSearchSummary,
    userEmail
  } = useApp();

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [exampleMessage, setExampleMessage] = useState('');
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagQuery, setTagQuery] = useState('');

  const visibleGenres = showAllGenres
    ? GENRES
    : GENRES.filter((g, i) => i < GENRE_LIMIT || selectedGenres.includes(g.value));

  const filteredTags = TAGS.filter((t) =>
    t.toLowerCase().includes(tagQuery.trim().toLowerCase())
  );

  const visibleTags = showAllTags || tagQuery.trim()
    ? filteredTags
    : filteredTags.filter((t, i) => i < TAG_LIMIT || selectedTags.includes(t));

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) return prev.filter(g => g !== genre);
      if (prev.length >= MAX_GENRES) return prev;
      return [...prev, genre];
    });
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= MAX_TAGS) return prev;
      return [...prev, tag];
    });
  };

  const loadExample = (key) => {
    const example = EXAMPLE_IDEAS[key];
    if (!example) return;
    setSelectedGenres(example.genres);
    setSelectedTags(example.tags);
    setDescription(example.description);
    setExampleMessage(`“${example.title}” dimuat. Kamu bisa mengubah isinya.`);
  };

  // Validation
  const isGenreValid = selectedGenres.length > 0;
  const isTagValid = selectedTags.length > 0;
  const trimmedLength = description.trim().length;
  const isDescriptionValid = trimmedLength >= 20;

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isGenreValid || !isTagValid || !isDescriptionValid) {
      if (!isGenreValid) {
        document.getElementById('genre-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!isTagValid) {
        document.getElementById('tag-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const descEl = document.getElementById('description');
        descEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        descEl?.focus();
      }
      return;
    }

    setSearchSummary(
      `${selectedGenres.join(', ')} · ${selectedTags.join(', ')} — “${description.trim()}”`
    );

    // Rekam ke tabel search_history di Supabase
    try {
      supabase.from('search_history').insert([{
        user_email: userEmail || 'developer@rekdev.id',
        genres: selectedGenres,
        tags: selectedTags,
        description: description.trim()
      }]).then(() => {});
    } catch (err) {
      console.warn('Gagal mencatat riwayat riset ke Supabase:', err);
    }

    navigateTo('results');
  };

  // Character counter calculations
  const length = description.length;
  const remaining = Math.max(20 - trimmedLength, 0);
  const charCountState = remaining > 0 ? 'minimum' : length >= 500 ? 'limit' : 'ready';
  const charCountText = remaining > 0
    ? `${length} / 240 · ${remaining} lagi`
    : length >= 220
    ? `${length} / 240 · hampir penuh`
    : `${length} / 240`;

  return (
    <>
      <section className="hero" id="search">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="sparkle">
              <Icon name="sparkle" />
            </span>{' '}
            RISET IDE GAME
          </div>
          <h1>
            Ide game kamu,
            <br />
            <em>punya peluang?</em>
          </h1>
          <p>
            Jelajahi game yang punya kesamaan dengan idemu. Kenali pasar sebelum
            mulai membangun.
          </p>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="form-column">
          <div className="section-heading">
            <div>
              <span className="step-kicker">MULAI DARI SINI</span>
              <h2>Ceritakan idemu</h2>
            </div>
            <span className="required-note">
              <i></i> Wajib diisi
            </span>
          </div>

          <form id="idea-form" onSubmit={handleSubmit} noValidate>
            <div className="form-block">
              <div className="label-row">
                <label>
                  Genre utama <span className="asterisk">*</span>
                </label>
                <span className="selection-count" id="genre-count">
                  {selectedGenres.length} / {MAX_GENRES} dipilih
                </span>
              </div>
              <p className="field-hint">Pilih genre yang paling menggambarkan gameplay-mu.</p>
              <div
                className={`chip-list ${showAllGenres ? 'expanded' : ''}`}
                id="genre-options"
                role="group"
                aria-label="Pilih genre utama"
                aria-invalid={hasAttemptedSubmit && !isGenreValid}
              >
                {visibleGenres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.value);
                  return (
                    <button
                      key={genre.value}
                      type="button"
                      className={`choice-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleGenre(genre.value)}
                      aria-pressed={isSelected}
                    >
                      <span className="chip-emoji">
                        <Icon name={genre.iconType} />
                      </span>
                      {genre.value}
                    </button>
                  );
                })}
              </div>
              {GENRES.length > GENRE_LIMIT && (
                <button
                  type="button"
                  className="chip-toggle"
                  onClick={() => setShowAllGenres((v) => !v)}
                >
                  {showAllGenres ? 'Lihat lebih sedikit' : `Lihat semua (${GENRES.length})`}
                </button>
              )}
              {hasAttemptedSubmit && !isGenreValid && (
                <div className="field-error" id="genre-error" role="alert">
                  Pilih setidaknya satu genre.
                </div>
              )}
            </div>

            <div className="form-block tag-block">
              <div className="label-row">
                <label>
                  Tag gameplay <span className="asterisk">*</span>
                </label>
                <span className="selection-count" id="tag-count">
                  {selectedTags.length} / {MAX_TAGS} dipilih
                </span>
              </div>
              <p className="field-hint">Pilih beberapa elemen yang jadi ciri khas game-mu.</p>
              <input
                type="search"
                className="chip-search"
                placeholder="Cari tag gameplay..."
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                aria-label="Cari tag gameplay"
              />
              <div
                className={`chip-list tag-list ${showAllTags || tagQuery.trim() ? 'expanded' : ''}`}
                id="tag-options"
                role="group"
                aria-label="Pilih tag gameplay"
                aria-invalid={hasAttemptedSubmit && !isTagValid}
              >
                {visibleTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`choice-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                      aria-pressed={isSelected}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {visibleTags.length === 0 && (
                <p className="field-hint">Tag tidak ditemukan.</p>
              )}
              {!tagQuery.trim() && TAGS.length > TAG_LIMIT && (
                <button
                  type="button"
                  className="chip-toggle"
                  onClick={() => setShowAllTags((v) => !v)}
                >
                  {showAllTags ? 'Lihat lebih sedikit' : `Lihat semua (${TAGS.length})`}
                </button>
              )}
              {hasAttemptedSubmit && !isTagValid && (
                <div className="field-error" id="tag-error" role="alert">
                  Pilih setidaknya satu tag gameplay.
                </div>
              )}
            </div>

            <div className="form-block description-block">
              <div className="label-row">
                <label htmlFor="description">
                  Deskripsi singkat <span className="asterisk">*</span>
                </label>
                <span
                  className="selection-count character-count"
                  id="char-count"
                  aria-live="polite"
                  aria-atomic="true"
                  data-state={charCountState}
                >
                  {charCountText}
                </span>
              </div>
              <p className="field-hint" id="description-hint">
                Apa yang pemain lakukan? Apa yang membuatnya berbeda? (20&ndash;240 karakter)
              </p>
              <div className={`textarea-wrap ${hasAttemptedSubmit && !isDescriptionValid ? 'invalid' : ''}`}>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={20}
                  maxLength={240}
                  aria-describedby="description-hint char-count description-error"
                  aria-invalid={hasAttemptedSubmit && !isDescriptionValid}
                  placeholder="Contoh: Game eksplorasi bawah laut dengan dunia yang berubah setiap kali pemain menyelam. Kumpulkan artefak dan ungkap misteri kota yang tenggelam..."
                  rows={4}
                />
                <span className="textarea-sparkle" aria-hidden="true">
                  <Icon name="sparkle" />
                </span>
              </div>
              {hasAttemptedSubmit && !isDescriptionValid && (
                <div className="field-error" id="description-error" role="alert">
                  {description.trim()
                    ? 'Deskripsi minimal 20 karakter.'
                    : 'Ceritakan sedikit tentang game yang ingin kamu buat.'}
                </div>
              )}
            </div>

            <div className="form-footer">
              <button className="submit-button" type="submit">
                <span>Temukan game serupa</span>
                <span className="button-arrow">
                  <Icon name="arrow-right" />
                </span>
              </button>
              
            </div>
          </form>
        </div>

        <aside className="examples-column" aria-label="Contoh ide game">
          <div className="examples-header">
            <div className="examples-icon">
              <Icon name="bulb" />
            </div>
            <div>
              <h3>Butuh inspirasi?</h3>
              <p>Coba salah satu ide ini</p>
            </div>
          </div>

          <div className="example-list">
            <button
              type="button"
              className="example-card"
              onClick={() => loadExample('cozy')}
            >
              <span className="example-art art-cozy">
                <span>
                  <Icon name="home" width="1em" height="1em" />
                </span>
              </span>
              <span className="example-copy">
                <strong>Cozy farm di luar angkasa</strong>
                <small>Simulation &middot; Exploration</small>
              </span>
              <span className="example-arrow">
                <Icon name="arrow-right" />
              </span>
            </button>

            <button
              type="button"
              className="example-card"
              onClick={() => loadExample('mystery')}
            >
              <span className="example-art art-mystery">
                <span>
                  <Icon name="compass" width="1em" height="1em" />
                </span>
              </span>
              <span className="example-copy">
                <strong>Misteri kota yang tenggelam</strong>
                <small>Adventure &middot; Story Rich</small>
              </span>
              <span className="example-arrow">
                <Icon name="arrow-right" />
              </span>
            </button>

            <button
              type="button"
              className="example-card"
              onClick={() => loadExample('tactics')}
            >
              <span className="example-art art-tactics">
                <span>
                  <Icon name="layers" width="1em" height="1em" />
                </span>
              </span>
              <span className="example-copy">
                <strong>Strategi koloni di Mars</strong>
                <small>Strategy &middot; Survival</small>
              </span>
              <span className="example-arrow">
                <Icon name="arrow-right" />
              </span>
            </button>
          </div>

          {exampleMessage && (
            <p className="example-status" id="example-status" role="status" aria-live="polite">
              {exampleMessage}
            </p>
          )}

          <div className="tip-card" id="how-it-works">
            <div className="tip-icon">
              <Icon name="bulb" />
            </div>
            <div>
              <strong>Bagaimana cara kerjanya?</strong>
              <p>Kami mencocokkan genre, tag, dan deskripsimu dengan ribuan game di Steam.</p>
              <a
                href="#search"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('idea-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pelajari lebih lanjut <span><Icon name="arrow-right" /></span>
              </a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}