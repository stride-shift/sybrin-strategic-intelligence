import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Send, Bot, User, FileText, Loader2, Sparkles } from 'lucide-react';
import { Streamdown } from 'streamdown';

const ResearchChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState(null);
  const [debugInfo, setDebugInfo] = useState(''); // For debugging visible on screen
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

    setDebugInfo('Starting...'); // Visible debug

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
      setDebugInfo('Fetching from API...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          previous_response_id: previousResponseId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setDebugInfo(`Error: ${response.status} - ${errorText}`);
        throw new Error('Failed to get response');
      }

      setDebugInfo('Starting stream read...');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamedContent = '';
      let responseId = null;

      let chunkCount = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setDebugInfo(`Done! Received ${chunkCount} chunks`);
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        setDebugInfo(`Chunk ${chunkCount}: ${chunk.substring(0, 50)}...`);
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
              } else if (event.type === 'response.done' && event.response) {
                // Save response ID for conversation continuity
                responseId = event.response.id;
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
      setDebugInfo(`Error: ${error.message}`);

      // Replace streaming message with error
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              type: 'error',
              content: `Sorry, I encountered an error: ${error.message}`,
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Debug Panel */}
      {debugInfo && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-xs font-mono">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

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
              {messages.map((message) => (
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
              ))}

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
    </div>
  );
};

export default ResearchChat;
