import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, TrendingUp, Newspaper, Search, ExternalLink, Calendar, User, MapPin, Sparkles, Filter, ChevronDown, ChevronUp, Cpu, Briefcase, DollarSign, X, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface NewsArticle {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image: string | null;
  video: string | null;
  publish_date: string;
  authors: string[];
  language: string;
  category: string;
  source_country: string;
  sentiment: number;
}

const API_KEY = 'ea14a5acce54421db69fd4634608cf9b';

export default function WorldNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, selectedCategory, selectedCountry]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Fetch tech, politics, and economy news from major countries
      const response = await fetch(
        `https://api.worldnewsapi.com/search-news?api-key=${API_KEY}&text=technology OR tech OR AI OR software OR politics OR economy&source-countries=us,gb,cn,in,de,jp&language=en&number=50&sort=publish-time&sort-direction=DESC`
      );
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    // Search filter - comprehensive search across all text fields
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((article) => {
        // Search in title
        const titleMatch = article.title?.toLowerCase().includes(query);
        
        // Search in summary
        const summaryMatch = article.summary?.toLowerCase().includes(query);
        
        // Search in text content
        const textMatch = article.text?.toLowerCase().includes(query);
        
        // Search in authors
        const authorMatch = article.authors?.some(author => 
          author?.toLowerCase().includes(query)
        );
        
        // Search in category
        const categoryMatch = article.category?.toLowerCase().includes(query);
        
        return titleMatch || summaryMatch || textMatch || authorMatch || categoryMatch;
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter((article) => article.source_country === selectedCountry);
    }

    setFilteredNews(filtered);
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return 'bg-green-100 text-green-700 border-green-200';
    if (sentiment < -0.2) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.2) return 'Positive';
    if (sentiment < -0.2) return 'Negative';
    return 'Neutral';
  };

  // Add technology to categories and ensure it's included
  const allCategories = ['all', 'technology', ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))];
  const categories = Array.from(new Set(allCategories));
  const countries = ['all', ...Array.from(new Set(news.map((n) => n.source_country).filter(Boolean)))];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'tech':
        return <Cpu className="w-4 h-4" />;
      case 'politics':
        return <Briefcase className="w-4 h-4" />;
      case 'economy':
      case 'business':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'tech':
        return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
      case 'politics':
        return 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200';
      case 'economy':
      case 'business':
        return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    WorldWire 360°
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Your gateway to real-time global currents.</p>
                </div>
              </div>
              <Button
                onClick={fetchNews}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, content, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 py-6 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Filters - Expandable */}
            <motion.div
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {/* Category Pills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Categories
                    </label>
                    {selectedCategory !== 'all' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                        className="h-6 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                          px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200
                          flex items-center gap-2
                          ${selectedCategory === cat
                            ? cat === 'all'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg'
                              : `${getCategoryColor(cat)} border-current shadow-md`
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }
                        `}
                      >
                        {cat !== 'all' && getCategoryIcon(cat)}
                        <span className="capitalize">
                          {cat === 'all' ? 'All News' : cat}
                        </span>
                        {selectedCategory === cat && cat !== 'all' && (
                          <Badge variant="secondary" className="ml-1 bg-white/30 text-current border-0">
                            {filteredNews.filter(n => n.category === cat).length}
                          </Badge>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Country Pills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Source Countries
                    </label>
                    {selectedCountry !== 'all' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCountry('all')}
                        className="h-6 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((country) => (
                      <motion.button
                        key={country}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCountry(country)}
                        className={`
                          px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200
                          ${selectedCountry === country
                            ? 'bg-gradient-to-r from-indigo-500 to-pink-600 text-white border-transparent shadow-lg'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }
                        `}
                      >
                        <span className="uppercase">
                          {country === 'all' ? 'All Countries' : country}
                        </span>
                        {selectedCountry === country && country !== 'all' && (
                          <Badge variant="secondary" className="ml-2 bg-white/30 text-white border-0">
                            {filteredNews.filter(n => n.source_country === country).length}
                          </Badge>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Newspaper className="w-4 h-4" />
                    <span className="font-medium">{filteredNews.length}</span>
                    <span>articles found</span>
                  </div>
                  {(selectedCategory !== 'all' || selectedCountry !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedCountry('all');
                      }}
                      className="text-xs border-gray-300 hover:bg-gray-50"
                    >
                      Reset All Filters
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Toggle Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
            >
              {showFilters ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Filters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Filters
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading latest news...</p>
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">No articles found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200 bg-white overflow-hidden group">
                    {/* Image */}
                    {article.image && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={`${getSentimentColor(article.sentiment)} border`}>
                            {getSentimentLabel(article.sentiment)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-5">
                      {/* Category & Country */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          {article.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {article.source_country.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.summary || article.text.substring(0, 150) + '...'}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(article.publish_date), 'MMM dd, yyyy • HH:mm')}
                        </div>
                        {article.authors && article.authors.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            {article.authors[0]}
                          </div>
                        )}
                      </div>

                      {/* Read More */}
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group/link"
                      >
                        Read full article
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
