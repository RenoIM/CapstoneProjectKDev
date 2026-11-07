import React from 'react';

export function DeleteGameModal({ isOpen, onClose, onConfirm, game }) {
  if (!isOpen || !game) return null;

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
        className="delete-confirm-dialog"
        open
        style={{ position: 'relative', display: 'block', margin: 'auto' }}
        aria-labelledby="delete-game-title"
      >
        <span className="delete-confirm-icon" aria-hidden="true">
          !
        </span>
        <h2 id="delete-game-title">Hapus game?</h2>
        <p id="delete-game-copy">{game.name} akan dihapus dari daftar data demo.</p>

        <div className="delete-confirm-actions">
          <button
            type="button"
            className="cancel-game-button"
            id="cancel-delete-game"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="confirm-delete-button"
            id="confirm-delete-game"
            onClick={() => {
              onConfirm(game.id);
              onClose();
            }}
          >
            Hapus game
          </button>
        </div>
      </dialog>
    </div>
  );
}
