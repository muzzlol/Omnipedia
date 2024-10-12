import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from 'axios';

interface Topic {
  _id: string;
  name: string;
  description: string;
}

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await axios.get(`http://localhost:5001/search/topics?query=${searchTerm}`);
          
          if (response.data.topics) {
            setSuggestions(response.data.topics);
            setNoResults(response.data.topics.length === 0);
            setError(null);
          } else {
            setError('Unexpected response format');
            setSuggestions([]);
            setNoResults(false);
          }
        } catch (error) {
          setError('Failed to fetch suggestions');
          setSuggestions([]);
          setNoResults(false);
        }
      } else {
        setSuggestions([]);
        setError(null);
        setNoResults(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search for a topic..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        {error && <div className="text-red-500">{error}</div>}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {noResults ? (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => setSearchTerm(suggestion.name)}
                >
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  {suggestion.name}
                </div>
              ))
            )}
            <div className='flex justify-center p-2 border-t'>
                <Button className='w-full'>Create Topic</Button>
            </div>
          </div>
        )}
      </div>
      <Button className="w-full">Create Topic</Button>
    </div>
  );
};

console.log("Searchbar component loaded");