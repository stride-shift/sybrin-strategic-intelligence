import React, { useState } from 'react';
import { X, Clock, Calendar, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QuestionDeepDive = ({ question, onClose }) => {
  if (!question) return null;

  const hasContent = question.shortTerm?.fullContent;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Question {question.id}
            </h2>
            <p className="text-gray-700">{question.question}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasContent ? (
            <div className="text-center py-12 text-gray-500">
              <p>No detailed analysis available for this question.</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                  h2: ({node, ...props}) => <h3 className="text-lg font-semibold mt-5 mb-2 text-gray-900" {...props} />,
                  h3: ({node, ...props}) => <h4 className="text-base font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                  p: ({node, ...props}) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-3 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-3 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} /></div>,
                  thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                  th: ({node, ...props}) => <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border border-gray-300" {...props} />,
                  td: ({node, ...props}) => <td className="px-3 py-2 text-sm text-gray-700 border border-gray-300" {...props} />,
                  code: ({node, inline, ...props}) =>
                    inline
                      ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
                      : <code className="block bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />
                }}
              >
                {question.shortTerm.fullContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2"
            onClick={() => {
              // Simple download functionality - could be enhanced
              const text = `Question ${question.id}\n\n${question.question}\n\n${question.nutshell}\n\n18-MONTH VIEW:\n${question.shortTerm?.fullContent || ''}\n\nLONG-TERM VIEW:\n${question.longTerm?.fullContent || ''}`;
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `question-${question.id}.txt`;
              a.click();
            }}
          >
            <Download className="w-4 h-4" />
            Download as Text
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDeepDive;
