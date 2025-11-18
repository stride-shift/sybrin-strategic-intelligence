import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Send, Bot, User, FileText, Loader2, Sparkles, Save, Check } from 'lucide-react';
import { Streamdown } from 'streamdown';

const ResearchChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState(null);
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [savedNoteIds, setSavedNoteIds] = useState(new Set());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [noteToSave, setNoteToSave] = useState(null);
  const [noteName, setNoteName] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create placeholder for streaming message
    const assistantMessageId = Date.now() + 1;
    const assistantMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          previous_response_id: previousResponseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamedContent = '';
      let responseId = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines (Server-Sent Events format)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;

          if (line.startsWith('data:')) {
            try {
              const jsonData = line.slice(5).trim(); // Remove 'data:' prefix
              if (jsonData === '[DONE]') continue;

              const event = JSON.parse(jsonData);

              // Handle OpenAI Responses API streaming format
              if (event.type === 'response.output_text.delta' && event.delta) {
                // Append text delta to streaming content
                streamedContent += event.delta;

                // Force immediate React update for real-time streaming
                flushSync(() => {
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: streamedContent }
                      : msg
                  ));
                });
              } else if (event.type === 'response.completed') {
                // Save response ID for conversation continuity
                responseId = event.response?.id || event.id;
              }
            } catch (e) {
              // Ignore malformed JSON - likely incomplete SSE event
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, isStreaming: false }
          : msg
      ));

      if (responseId) {
        setPreviousResponseId(responseId);
      }

    } catch (error) {
      // Replace streaming message with error
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              type: 'error',
              content: 'Sorry, I encountered an error. Please try again.',
              isStreaming: false,
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setPreviousResponseId(null);
    inputRef.current?.focus();
  };

  const exampleQuestions = [
    "What are the key market entry barriers in Kenya?",
    "Compare regulatory environments in Ghana vs Tanzania",
    "What are the top customer pain points in digital banking?",
    "Which African markets have the best growth potential?",
  ];

  const handleExampleClick = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const openSaveDialog = (message, userQuestion) => {
    setNoteToSave({ message, userQuestion });
    setNoteName('');
    setShowSaveDialog(true);
  };

  const closeSaveDialog = () => {
    setShowSaveDialog(false);
    setNoteToSave(null);
    setNoteName('');
  };

  const saveNote = async () => {
    if (!noteName.trim() || !noteToSave) return;

    setSavingNoteId(noteToSave.message.id);

    try {
      const response = await fetch('/api/save-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteName: noteName.trim(),
          question: noteToSave.userQuestion,
          answer: noteToSave.message.content,
          sources: noteToSave.message.citations || []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      // Mark this message as saved
      setSavedNoteIds(prev => new Set([...prev, noteToSave.message.id]));
      closeSaveDialog();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSavingNoteId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Research Assistant</h1>
              <p className="text-sm text-gray-600">Powered by GPT-5.1 • 248 documents indexed</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={startNewConversation}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              New Conversation
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ask me anything about Sybrin's research
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                I have access to 248 research documents covering market intelligence, competitive analysis,
                regulatory landscapes, and strategic insights across African and Southeast Asian markets.
              </p>

              {/* Example Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {exampleQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(question)}
                    className="p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-purple-300 hover:bg-purple-50 transition-all group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-purple-700">{question}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, idx) => {
                // Find the user question that corresponds to this assistant answer
                const userQuestion = message.type === 'assistant' && idx > 0 && messages[idx - 1].type === 'user'
                  ? messages[idx - 1].content
                  : '';

                return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg h-10 w-10 flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div
                      className={`rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white max-w-xl'
                          : message.type === 'error'
                          ? 'bg-red-50 border border-red-200 text-red-800'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {message.type === 'assistant' ? (
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-700">
                            <Streamdown>
                              {message.content}
                            </Streamdown>
                          </div>

                          {/* Streaming indicator */}
                          {message.isStreaming && (
                            <div className="flex items-center gap-2 mt-3 text-gray-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span className="text-xs">Generating response...</span>
                            </div>
                          )}

                          {/* Citations */}
                          {!message.isStreaming && message.citations && message.citations.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-700">Sources</span>
                              </div>
                              <div className="space-y-2">
                                {message.citations.map((citation, idx) => (
                                  <div key={idx} className="bg-gray-50 rounded p-3 text-xs">
                                    <p className="font-medium text-gray-900 mb-1">
                                      {citation.file_name || `Document ${idx + 1}`}
                                    </p>
                                    {citation.content && (
                                      <p className="text-gray-600 line-clamp-2">{citation.content}...</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Save Button */}
                          {!message.isStreaming && message.content && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => openSaveDialog(message, userQuestion)}
                                disabled={savedNoteIds.has(message.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  savedNoteIds.has(message.id)
                                    ? 'bg-green-50 text-green-700 cursor-default'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                }`}
                              >
                                {savedNoteIds.has(message.id) ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Saved to Notes
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4" />
                                    Save as Note
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="bg-purple-200 p-2 rounded-lg h-10 w-10 flex-shrink-0">
                      <User className="w-6 h-6 text-purple-700" />
                    </div>
                  )}
                </div>
              );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg h-10 w-10 flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Searching research documents...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the research..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg px-6 py-3 font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Save Note Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Save Note</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Name
              </label>
              <input
                type="text"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                placeholder="e.g., Kenya Market Entry Barriers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && noteName.trim()) {
                    saveNote();
                  }
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                {noteToSave?.userQuestion || 'No question available'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer Preview
              </label>
              <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                {noteToSave?.message.content.substring(0, 300)}
                {noteToSave?.message.content.length > 300 && '...'}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeSaveDialog}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                disabled={savingNoteId !== null}
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                disabled={!noteName.trim() || savingNoteId !== null}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingNoteId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchChat;
