import React, { useState, useEffect } from 'react';
import { TAGS } from '../../constants/data';

export function AddEditGameModal({ isOpen, onClose, onSave, editingGame }) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [description, setDescription] = useState('');
  const [ownersMin, setOwnersMin] = useState('');
  const [ownersMax, setOwnersMax] = useState('');
  const [developer, setDeveloper] = useState('');
  const [price, setPrice] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (editingGame) {
      setName(editingGame.name || '');
      setGenre(editingGame.genre || '');
      const existingTags = Array.isArray(editingGame.tags) && editingGame.tags.length > 0
        ? editingGame.tags
        : (editingGame.tagLabels || ['Singleplayer']);
      setSelectedTags(existingTags);
      setDescription(editingGame.description || '');
      setOwnersMin(editingGame.ownersMin || '');
      setOwnersMax(editingGame.ownersMax || '');
      setDeveloper(editingGame.developer || '');
      setPrice(editingGame.price !== undefined ? editingGame.price : '');
      setReleaseDate(editingGame.release_date || editingGame.releaseDate || '');
    } else {
      setName('');
      setGenre('');
      setSelectedTags(['Singleplayer']);
      setDescription('');
      setOwnersMin('');
      setOwnersMax('');
      setDeveloper('');
      setPrice('');
      setReleaseDate(new Date().toISOString().split('T')[0]);
    }
    setCustomTagInput('');
    setFeedback('');
  }, [editingGame, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      setFeedback('Nama game wajib diisi (minimal 2 karakter).');
      return;
    }
    if (!genre) {
      setFeedback('Genre utama wajib dipilih.');
      return;
    }

    if (ownersMin && ownersMax && Number(ownersMin) > Number(ownersMax)) {
      setFeedback('Jumlah maksimum harus sama dengan atau lebih besar dari jumlah minimum.');
      return;
    }

    let calculatedOwners = editingGame ? editingGame.owners : '0 rb';
    let numericEstimate = 0;
    if (ownersMin && ownersMax) {
      numericEstimate = Math.round((Number(ownersMin) + Number(ownersMax)) / 2);
      calculatedOwners = `${new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(numericEstimate)} pemilik`;
    }

    const payload = {
      id: editingGame ? editingGame.id : undefined,
      name: name.trim(),
      genre,
      genres: [genre],
      tags: selectedTags.length > 0 ? selectedTags : ['Singleplayer'],
      description: description.trim(),
      ownersMin,
      ownersMax,
      owners: calculatedOwners,
      ownersEstimated: numericEstimate || (editingGame ? editingGame.ownersEstimated : 0),
      developer: developer.trim() || 'RekDev Studio',
      price: price ? Number(price) : 0,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      release_date: releaseDate || new Date().toISOString().split('T')[0],
      appId: editingGame ? (editingGame.appId || editingGame.app_id) : Math.floor(1000000 + Math.random() * 9000000).toString(),
      source: 'Supabase',
      artColor: editingGame ? editingGame.artColor : 'art-green',
      artInitial: name.trim().charAt(0).toUpperCase()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#090a0ee0',
        backdropFilter: 'blur(3px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <dialog
        className="game-form-dialog"
        open
        style={{ position: 'relative', display: 'block', margin: 'auto' }}
        aria-labelledby="add-game-title"
      >
        <div className="game-form-heading">
          <div>
            <span className="panel-eyebrow">KATALOG GAME</span>
            <h2 id="add-game-title">{editingGame ? 'Ubah game' : 'Tambah game'}</h2>
            <p>Lengkapi informasi dasar untuk pratinjau data.</p>
          </div>
          <button
            type="button"
            className="dialog-close"
            id="close-add-game"
            onClick={onClose}
            aria-label="Tutup formulir"
          >
            &times;
          </button>
        </div>

        <form className="game-admin-form" id="add-game-form" onSubmit={handleSubmit} noValidate>
          <label className="admin-field">
            <span>
              Nama game <i>*</i>
            </span>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={255}
              placeholder="Contoh: Moonlit Vale"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFeedback('');
              }}
            />
            <small id="name-required">Wajib diisi, minimal 2 karakter.</small>
          </label>

          <label className="admin-field">
            <span>
              Genre utama <i>*</i>
            </span>
            <select
              name="genre"
              required
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setFeedback('');
              }}
            >
              <option value="">Pilih genre</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="RPG">RPG</option>
              <option value="Strategy">Strategy</option>
              <option value="Simulation">Simulation</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Horror">Horror</option>
              <option value="Casual">Casual</option>
            </select>
            <small>Wajib memilih satu genre.</small>
          </label>

          <div className="admin-field">
            <span>Tag &amp; Mekanik Game</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              {TAGS.map((t) => {
                const isSelected = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTags(prev =>
                        isSelected ? prev.filter(x => x !== t) : [...prev, t]
                      );
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #4e6b36' : '1px solid #2d303b',
                      background: isSelected ? '#25351e' : '#171922',
                      color: isSelected ? '#c7f36b' : '#9295a3',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{t}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah tag khusus (misal: Pixel Art)..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
                      setSelectedTags(prev => [...prev, customTagInput.trim()]);
                      setCustomTagInput('');
                    }
                  }
                }}
                style={{ fontSize: '12px' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
                    setSelectedTags(prev => [...prev, customTagInput.trim()]);
                    setCustomTagInput('');
                  }
                }}
                style={{
                  padding: '6px 14px',
                  background: '#252833',
                  color: '#eeeef3',
                  borderRadius: '6px',
                  border: '1px solid #3d4254',
                  fontSize: '11px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                + Tambah
              </button>
            </div>
            <small>Pilih tag populer di atas atau ketik tag baru.</small>
          </div>

          <label className="admin-field">
            <span>Deskripsi</span>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Jelaskan game secara singkat"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="admin-field-pair">
            <label className="admin-field">
              <span>Estimasi pemilik minimum</span>
              <input
                name="owners_min"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={ownersMin}
                onChange={(e) => {
                  setOwnersMin(e.target.value);
                  setFeedback('');
                }}
              />
            </label>
            <label className="admin-field">
              <span>Estimasi pemilik maksimum</span>
              <input
                name="owners_max"
                type="number"
                min="0"
                step="1"
                placeholder="Opsional"
                value={ownersMax}
                onChange={(e) => {
                  setOwnersMax(e.target.value);
                  setFeedback('');
                }}
              />
            </label>
          </div>

          <div className="admin-field-pair">
            <label className="admin-field">
              <span>Developer</span>
              <input
                name="developer"
                type="text"
                maxLength={255}
                placeholder="Nama developer"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Harga (USD)</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Tanggal Rilis</span>
            <input
              name="release_date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
            <small>Format tanggal rilis resmi (YYYY-MM-DD).</small>
          </label>

          {feedback && (
            <p className="form-feedback" role="alert">
              {feedback}
            </p>
          )}

          <div className="admin-form-actions">
            <button
              type="button"
              className="cancel-game-button"
              id="cancel-add-game"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="add-game-button">
              {editingGame ? 'Simpan perubahan' : 'Validasi data'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
