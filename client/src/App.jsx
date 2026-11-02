
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  LayoutGrid,
  Clock3,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FileText,
  Sparkles,
  Check,
  Grid2X2,
  List,
  ArrowUpRight
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedView, setSelectedView] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?search=${encodeURIComponent(search)}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load notes.");
      }

      setNotes(result.data);
    } catch (error) {
      showToast(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 250);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const recentNotes = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return notes.filter((note) => {
      const updated = new Date(note.updated_at).getTime();
      return !Number.isNaN(updated) && updated >= sevenDaysAgo;
    });
  }, [notes]);

  const visibleNotes = selectedView === "recent" ? recentNotes : notes;

  function openNewNote() {
    setTitle("");
    setContent("");
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      showToast("Please enter a title and note content.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save note.");
      }

      setModalOpen(false);
      setTitle("");
      setContent("");
      setEditingId(null);

      await fetchNotes();
      showToast(result.message || "Note saved successfully.");
    } catch (error) {
      showToast(error.message || "Could not save your note.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete note.");
      }

      if (editingId === id) closeModal();

      await fetchNotes();
      showToast(result.message || "Note deleted successfully.");
    } catch (error) {
      showToast(error.message || "Could not delete this note.");
    }
  }

  function formatDate(date) {
    if (!date) return "Recently";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Recently";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="NoteNest home">
          <span className="brand-mark">
            <BookOpen size={22} strokeWidth={2.2} />
          </span>
          <span>note<span className="brand-light">nest</span></span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${selectedView === "all" ? "active" : ""}`}
            onClick={() => setSelectedView("all")}
          >
            <LayoutGrid size={18} />
            <span>All notes</span>
            <span className="nav-count">{notes.length}</span>
          </button>

          <button
            className={`nav-item ${selectedView === "recent" ? "active" : ""}`}
            onClick={() => setSelectedView("recent")}
          >
            <Clock3 size={18} />
            <span>Recently updated</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-decoration">
            <Sparkles size={19} />
            <p>A little space for all your thoughts.</p>
          </div>

          <div className="profile">
            <div className="profile-avatar">N</div>
            <div className="profile-info">
              <strong>My workspace</strong>
              <span>Personal notes</span>
            </div>
            <ArrowUpRight size={16} className="profile-arrow" />
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>
            <strong>
              {selectedView === "all" ? "All notes" : "Recently updated"}
            </strong>
          </div>

          <div className="topbar-right">
            <span className="status-dot" />
            <span className="saved-status">Your workspace is ready</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> YOUR PERSONAL SPACE
              </div>
              <h1>
                Your thoughts,
                <br />
                <span>beautifully organized.</span>
              </h1>
              <p className="welcome-description">
                A calm place to collect ideas, keep memories, and make sense
                of everything.
              </p>
            </div>

            <button className="new-note-button" onClick={openNewNote}>
              <Plus size={18} />
              New note
            </button>
          </section>

          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-icon"><FileText size={19} /></div>
              <div>
                <span>Total notes</span>
                <strong>{notes.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon recent-icon"><Clock3 size={19} /></div>
              <div>
                <span>Updated this week</span>
                <strong>{recentNotes.length}</strong>
              </div>
            </div>
          </section>

          <section className="notes-area">
            <div className="section-heading">
              <div>
                <h2>
                  {selectedView === "all" ? "All your notes" : "Recently updated"}
                </h2>
                <p>
                  {visibleNotes.length}{" "}
                  {visibleNotes.length === 1 ? "note" : "notes"} in your collection
                </p>
              </div>

              <div className="toolbar">
                <label className="search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  {search && (
                    <button
                      className="clear-search"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>

                <div className="view-toggle">
                  <button
                    className={viewMode === "grid" ? "selected" : ""}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <Grid2X2 size={17} />
                  </button>
                  <button
                    className={viewMode === "list" ? "selected" : ""}
                    onClick={() => setViewMode("list")}
                    title="List view"
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon"><FileText size={27} /></div>
                <h3>Loading your notes</h3>
                <p>Getting your workspace ready...</p>
              </div>
            ) : visibleNotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FileText size={27} /></div>
                <h3>
                  {search
                    ? "No notes found"
                    : selectedView === "recent"
                      ? "Nothing updated recently"
                      : "Your space is waiting"}
                </h3>
                <p>
                  {search
                    ? "Try a different title or keyword."
                    : selectedView === "recent"
                      ? "Notes updated in the last seven days will appear here."
                      : "Start with a thought, an idea, or a little reminder."}
                </p>
                {!search && selectedView === "all" && (
                  <button className="empty-create-button" onClick={openNewNote}>
                    <Plus size={17} /> Create your first note
                  </button>
                )}
              </div>
            ) : (
              <div className={`notes-collection ${viewMode}`}>
                {visibleNotes.map((note, index) => (
                  <article className="note-card" key={note.id}>
                    <div className="note-card-header">
                      <span className={`note-symbol symbol-${index % 4}`}>
                        <FileText size={17} />
                      </span>

                      <div className="card-actions">
                        <button
                          onClick={() => openEditNote(note)}
                          title="Edit note"
                          aria-label={`Edit ${note.title}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(note.id)}
                          title="Delete note"
                          aria-label={`Delete ${note.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3>{note.title}</h3>
                    <p className="note-preview">{note.content}</p>

                    <div className="note-card-footer">
                      <span><Clock3 size={13} /> {formatDate(note.updated_at)}</span>
                      <button
                        onClick={() => openEditNote(note)}
                        className="open-note"
                        aria-label={`Open ${note.title}`}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="workspace-footer">
            <span>Made for your thoughts.</span>
            <span>NoteNest <span className="footer-dot">✦</span></span>
          </footer>
        </div>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className="note-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingId ? "YOUR COLLECTION" : "NEW THOUGHT"}
                </span>
                <h2 id="modal-title">
                  {editingId ? "Edit your note" : "Create a note"}
                </h2>
              </div>
              <button className="modal-close" onClick={closeModal} disabled={saving} aria-label="Close editor">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="note-title">TITLE</label>
              <input
                id="note-title"
                className="modal-title-input"
                type="text"
                placeholder="Give your note a name..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={255}
                autoFocus
              />

              <label className="field-label content-label" htmlFor="note-content">YOUR THOUGHTS</label>
              <textarea
                id="note-content"
                className="modal-content-input"
                placeholder="Start writing something wonderful..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={9}
              />

              <div className="modal-footer">
                <span>{content.length} characters</span>
                <div>
                  <button type="button" className="secondary-button" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="new-note-button save-button" disabled={saving}>
                    <Check size={17} />
                    {saving ? "Saving..." : editingId ? "Save changes" : "Save note"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast-message">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
