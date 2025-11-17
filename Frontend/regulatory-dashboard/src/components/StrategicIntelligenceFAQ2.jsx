import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  Users,
  Handshake,
  Globe,
  Lightbulb,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarketPrioritizationOverview from './MarketPrioritizationOverview';
import QuestionDeepDive from './QuestionDeepDive';
import intelligenceData from '../data/strategic-intelligence.json';

// Icon mapping
const iconMap = {
  'Target': Target,
  'TrendingUp': TrendingUp,
  'Shield': Shield,
  'Users': Users,
  'Handshake': Handshake,
  'Globe': Globe,
  'Lightbulb': Lightbulb,
  'DollarSign': DollarSign
};

// Color mapping
const colorClasses = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  red: 'bg-red-100 text-red-700 border-red-300'
};

const StrategicIntelligenceFAQ2 = () => {
  const [data] = useState(intelligenceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState(
    intelligenceData.categories && intelligenceData.categories.length > 0
      ? { [intelligenceData.categories[0].id]: true }
      : {}
  );
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Expand the section
      setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    }
  };

  const filterQuestions = (categories) => {
    if (!categories) return [];

    return categories.map(category => ({
      ...category,
      questions: category.questions.filter(q => {
        // Search filter only
        const matchesSearch = !searchTerm ||
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.nutshell?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.shortTerm?.keyInsights?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())) ||
          q.longTerm?.keyInsights?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
      })
    })).filter(cat => cat.questions.length > 0);
  };

  const filteredCategories = filterQuestions(data.categories);
  const totalQuestions = data.metadata.totalQuestions;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Strategic Intelligence</h2>
            <p className="text-sm text-gray-600 mb-4">
              Market insights & decision-making framework
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{totalQuestions}</div>
                <div className="text-xs text-blue-600">Questions</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{data.categories.length}</div>
                <div className="text-xs text-purple-600">Categories</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Navigation */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">CATEGORIES</div>
              {data.categories.map((category) => {
                const Icon = iconMap[category.icon] || Target;
                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToSection(category.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className={`p-2 rounded-lg ${colorClasses[category.color] || colorClasses.blue}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.questions.length} questions
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Market Prioritization Overview */}
          {data.overview && (
            <MarketPrioritizationOverview overviewData={data.overview} />
          )}

          {/* Categories and Questions */}
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const Icon = iconMap[category.icon] || Target;
              const isExpanded = expandedSections[category.id];

              return (
                <div
                  key={category.id}
                  id={category.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colorClasses[category.color] || colorClasses.blue}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{category.questions.length} questions</span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Questions */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {category.questions.map((question, idx) => {
                        const isQuestionExpanded = expandedQuestions.has(question.id);

                        return (
                          <div
                            key={question.id}
                            className={`${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                          >
                            {/* Question Header */}
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-gray-500">
                                      Q{question.id}
                                    </span>
                                  </div>
                                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                                    {question.question}
                                  </h4>
                                  {question.nutshell && (
                                    <div className="text-sm text-gray-600 leading-relaxed">
                                      <span className="font-semibold text-gray-700">In a nutshell:</span>{' '}
                                      <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                          p: ({node, ...props}) => <span className="inline" {...props} />,
                                          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />
                                        }}
                                      >
                                        {question.nutshell}
                                      </ReactMarkdown>
                                    </div>
                                  )}
                                </div>
                                {isQuestionExpanded ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                              </div>
                            </button>

                            {/* Expanded Question Content */}
                            {isQuestionExpanded && (
                              <div className="px-6 pb-6">
                                {/* Key Insights */}
                                <div className="space-y-4">
                                  {/* Timeframe-specific insights */}
                                  {question.shortTerm?.keyInsights?.length > 0 && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                        <h5 className="font-semibold text-orange-900">18-Month View: Key Insights</h5>
                                      </div>
                                      <ul className="space-y-2">
                                        {question.shortTerm.keyInsights.map((insight, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-0.5 flex-shrink-0">•</span>
                                            <div className="text-sm text-gray-700 flex-1">
                                              <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                  p: ({node, ...props}) => <span {...props} />,
                                                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />
                                                }}
                                              >
                                                {insight}
                                              </ReactMarkdown>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {question.longTerm?.keyInsights?.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <h5 className="font-semibold text-blue-900">Long-Term View: Key Insights</h5>
                                      </div>
                                      <ul className="space-y-2">
                                        {question.longTerm.keyInsights.map((insight, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                                            <div className="text-sm text-gray-700 flex-1">
                                              <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                  p: ({node, ...props}) => <span {...props} />,
                                                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />
                                                }}
                                              >
                                                {insight}
                                              </ReactMarkdown>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* General insights (for questions without timeframe sections) */}
                                  {question.generalInsights?.length > 0 && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <h5 className="font-semibold text-purple-900">Key Insights</h5>
                                      </div>
                                      <ul className="space-y-2">
                                        {question.generalInsights.map((insight, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <span className="text-purple-600 mt-0.5 flex-shrink-0">•</span>
                                            <div className="text-sm text-gray-700 flex-1">
                                              <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                  p: ({node, ...props}) => <span {...props} />,
                                                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />
                                                }}
                                              >
                                                {insight}
                                              </ReactMarkdown>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Read Full Analysis Button */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <button
                                    onClick={() => setSelectedQuestion(question)}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Read Full Analysis
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No questions match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Deep Dive Modal */}
      {selectedQuestion && (
        <QuestionDeepDive
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};

export default StrategicIntelligenceFAQ2;
