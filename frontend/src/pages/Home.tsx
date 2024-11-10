import React from 'react';
import { SearchBar } from '@/components/Searchbar';
import { Globe } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-8"><Globe className="w-24 h-24 text-main" /></h1>
      <SearchBar />
    </div>
  );
};
