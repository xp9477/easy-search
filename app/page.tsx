"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import searchEnginesData from "@/data/search-engines.json"

interface SearchEngine {
  name: string
  url: string
}

export default function EasySearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngines] = useState<SearchEngine[]>(searchEnginesData)

  const handleSearch = (engine: SearchEngine) => {
    if (!searchQuery.trim()) return

    const searchUrl = engine.url.replace("{query}", encodeURIComponent(searchQuery.trim()))
    window.open(searchUrl, "_blank")
  }

  const handleKeyPress = (e: React.KeyboardEvent, engine?: SearchEngine) => {
    if (e.key === "Enter") {
      if (engine) {
        handleSearch(engine)
      } else if (searchEngines.length > 0) {
        // Default to first search engine (Google) when pressing Enter in search bar
        handleSearch(searchEngines[1]) // Google is at index 1
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-8">
            Easy<span className="text-primary">Search</span>
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter your search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                className="pl-12 pr-4 py-4 text-lg bg-input border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Search Engine Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {searchEngines.map((engine, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleSearch(engine)}
              onKeyPress={(e) => handleKeyPress(e, engine)}
              className="h-16 bg-card hover:bg-accent hover:text-accent-foreground border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary"
            >
              <span className="text-sm font-medium text-card-foreground group-hover:text-accent-foreground">
                {engine.name}
              </span>
            </Button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground text-sm">Search across multiple platforms with one click</p>
        </div>
      </div>
    </div>
  )
}
