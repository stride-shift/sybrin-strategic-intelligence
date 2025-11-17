import React, { useState } from 'react';
import { Globe, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarketPrioritizationOverview = ({ overviewData }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('18-month');

  if (!overviewData) {
    return null;
  }


  // Rankings from the document
  const rankings = {
    shortTerm: [
      'Kenya',
      'Zambia',
      'Tanzania',
      'Philippines',
      'Ghana',
      'Uganda',
      'Botswana',
      'Malawi',
      'Mozambique',
      'Namibia',
      'Zimbabwe',
      'Lesotho',
      'Ethiopia',
      'South Africa'
    ],
    longTerm: [
      'Philippines',
      'Kenya',
      'Ghana',
      'Tanzania',
      'Zambia',
      'Mozambique',
      'Uganda',
      'Botswana',
      'Namibia',
      'Ethiopia',
      'Malawi',
      'Zimbabwe',
      'Lesotho',
      'South Africa'
    ]
  };
  const currentRanking = selectedTimeframe === '18-month' ? rankings.shortTerm : rankings.longTerm;
  const topTier = currentRanking.slice(0, 7);
  const secondTier = currentRanking.slice(7);

  // Extract nutshell from content
  const nutshellMatch = overviewData.fullContent?.match(/In a nutshell:\s*([^]*?)(?=\n\n##|\n\nBelow)/i);
  const nutshell = nutshellMatch?.[1]?.trim() ||
    "Based on research, the most attractive opportunities vary between 18-month exit view and longer-term strategic potential.";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Market Prioritization Matrix</h2>
              <p className="text-blue-100 text-sm">
                Strategic ranking of 14 markets for Sybrin's expansion
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Executive Summary</h3>
            <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {nutshell}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setSelectedTimeframe('18-month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === '18-month'
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            18-Month Exit View
          </button>
          <button
            onClick={() => setSelectedTimeframe('long-term')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === 'long-term'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Long-Term Strategic
          </button>
        </div>
      </div>

      {/* Rankings Display */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Tier */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h4 className="font-semibold text-gray-900">Top Tier Markets</h4>
              <span className="text-xs text-gray-500 ml-auto">{topTier.length} markets</span>
            </div>
            <div className="space-y-2">
              {topTier.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="flex items-center justify-center w-7 h-7 bg-green-600 text-white text-sm font-bold rounded-full">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{country}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Second Tier */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h4 className="font-semibold text-gray-900">Second Tier Markets</h4>
              <span className="text-xs text-gray-500 ml-auto">{secondTier.length} markets</span>
            </div>
            <div className="space-y-2">
              {secondTier.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <span className="flex items-center justify-center w-7 h-7 bg-gray-500 text-white text-sm font-bold rounded-full">
                    {topTier.length + index + 1}
                  </span>
                  <span className="font-medium text-gray-700">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA to detailed analysis */}
        {!expanded && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 mx-auto"
            >
              View Detailed Country Analysis
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Expanded Full Content */}
      {expanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Detailed Country-by-Country Analysis</h3>

          {overviewData.fullContent ? (
            <div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-3 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-3 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full divide-y divide-gray-300 border border-gray-300 text-xs" {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                      th: ({node, ...props}) => <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-900 border border-gray-300" {...props} />,
                      td: ({node, ...props}) => <td className="px-2 py-1.5 text-xs text-gray-700 border border-gray-300" {...props} />,
                      code: ({node, inline, ...props}) =>
                        inline
                          ? <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800" {...props} />
                          : <code className="block bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-x-auto" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />
                    }}
                  >
                    {overviewData.fullContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-700">⚠️ No content available to display</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center gap-2 mx-auto"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse Detailed Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPrioritizationOverview;
