"use client";

import Header from "./_components/Header";
import MentorsCards from "./_components/MentorsCards";
import { useState } from "react";

export default function FindingMentor() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <>
      <Header
        onSearch={(q) => {
          setQuery(q);
        }}
        onFilterChange={(f) => setFilters(f)}
      />
      <MentorsCards query={query} filters={filters} />
    </>
  );
}
