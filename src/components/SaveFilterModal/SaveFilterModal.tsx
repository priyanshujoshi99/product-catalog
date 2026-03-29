import { useState } from 'react';

interface Props {
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function SaveFilterModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Save filter set">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal__title">Save Filter Set</h3>
        <form onSubmit={handleSubmit}>
          <label className="filter-label" htmlFor="filter-name-input">Name</label>
          <input
            id="filter-name-input"
            className="filter-input"
            type="text"
            placeholder="e.g. Budget Electronics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            aria-label="Name for this filter set"
          />
          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
