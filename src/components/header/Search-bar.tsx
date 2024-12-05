'use client';

import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [searchLength, setSearchLength] = useState(0);

  return (
    <div className="hidden w-1/2 max-w-md sm:!flex sm:gap-2">
      <Input
        placeholder="Explore no E-Shop"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setSearchLength(event.target.value.length);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && searchLength > 0) {
            location.replace(`/search/${search}`);
          }
        }}
        className="focus-visible:ring-offset-0"
      />

      <Button
        disabled={searchLength === 0}
        onClick={() => {
          location.replace(`/search/${search}`);
          setSearch('');
        }}
        className="bg-slate-700 flex items-center rounded-md transition-colors duration-300 hover:bg-slate-600"
      >
        <span className="sr-only">Pesquisar</span>
        <Search />
      </Button>
    </div>
  );
};
