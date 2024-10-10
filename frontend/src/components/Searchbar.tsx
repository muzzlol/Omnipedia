import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions - in a real app, these would come from an API
  const suggestions = [
    'React',
    'React hooks',
    'React router',
    'React native',
    'React redux',
  ];

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
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => setSearchTerm(suggestion)}
              >
                <Search className="h-4 w-4 mr-2 text-gray-400" />
                {suggestion}
              </div>
            ))}
            <div className="flex justify-center p-2 border-t">
              <Button className="w-full">Create Topic</Button>
            </div>
          </div>
        )}
      </div>
      <Button className="w-full">Create Topic</Button>
    </div>
  );
};