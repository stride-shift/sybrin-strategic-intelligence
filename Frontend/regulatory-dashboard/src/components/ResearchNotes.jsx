import React, { useState, useEffect } from 'react';
import { BookMarked, Search, Trash2, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Streamdown } from 'streamdown';

const ResearchNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get-notes');

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setDeletingNoteId(noteId);

    try {
      const response = await fetch('/api/delete-note', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Remove the note from the list
      setNotes(prev => prev.filter(note => note.id !== noteId));

      // Collapse if this was the expanded note
      if (expandedNoteId === noteId) {
        setExpandedNoteId(null);
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeletingNoteId(null);
    }
  };

  const toggleExpand = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchTerm.toLowerCase();
    return (
      note.note_name.toLowerCase().includes(searchLower) ||
      note.question.toLowerCase().includes(searchLower) ||
      note.answer.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-sybrin-blue-600 p-3 rounded-lg">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Research Notes</h1>
              <p className="text-sm text-gray-600">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved from Research Assistant
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes by name, question, or answer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading notes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Notes</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchNotes}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Save answers from the Research Assistant to build your personal knowledge base'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Note Header - Always Visible */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => toggleExpand(note.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {note.note_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                        {note.sources && note.sources.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{note.sources.length} sources</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      disabled={deletingNoteId === note.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete note"
                    >
                      {deletingNoteId === note.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Question Preview */}
                  <div className="mt-3 bg-gray-50 rounded p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                    <p className="text-sm text-gray-600">{note.question}</p>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedNoteId === note.id && (
                  <div className="px-5 pb-5 border-t border-gray-200">
                    <div className="pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Answer:</p>
                      <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded p-4">
                        <Streamdown>{note.answer}</Streamdown>
                      </div>

                      {/* Sources */}
                      {note.sources && note.sources.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Sources:</p>
                          <div className="space-y-2">
                            {note.sources.map((source, idx) => (
                              <div key={idx} className="bg-gray-50 rounded p-3 text-xs">
                                <p className="font-medium text-gray-900 mb-1">
                                  {source.file_name || `Document ${idx + 1}`}
                                </p>
                                {source.content && (
                                  <p className="text-gray-600">{source.content}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Indicator */}
                <div className="px-5 pb-3">
                  <button
                    onClick={() => toggleExpand(note.id)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {expandedNoteId === note.id ? 'Show less' : 'Show more'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchNotes;
