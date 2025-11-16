"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import searchEnginesData from "@/data/search-engines.json"

interface SearchEngine {
  name: string
  url: string
  url_scheme?: string
}

const CACHE_KEY = "easysearch_engines_cache"
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const CACHE_VERSION = "1.0.2" // Increment this when search engines data changes

export default function EasySearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadSearchEngines = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp, version } = JSON.parse(cached)
          const now = Date.now()

          if (now - timestamp < CACHE_EXPIRY && version === CACHE_VERSION) {
            setSearchEngines(data)
            setIsLoading(false)
            return
          } else {
            localStorage.removeItem(CACHE_KEY)
          }
        }

        setSearchEngines(searchEnginesData)
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: searchEnginesData,
            timestamp: Date.now(),
            version: CACHE_VERSION,
          }),
        )
        setIsLoading(false)
      } catch (error) {
        console.error("Cache error:", error)
        setSearchEngines(searchEnginesData)
        setIsLoading(false)
      }
    }

    loadSearchEngines()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()))
    }

    checkMobile()

    const keywordParam = searchParams.get("keyword")
    if (keywordParam) {
      setSearchQuery(decodeURIComponent(keywordParam))
    }

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, 100)
  }, [searchParams])

  const handleSearch = (engine: SearchEngine) => {
    if (!searchQuery.trim()) return

    const targetUrl = isMobile && engine.url_scheme ? engine.url_scheme : engine.url
    const searchUrl = targetUrl.replace("{query}", encodeURIComponent(searchQuery.trim()))
    window.open(searchUrl, "_blank")
  }

  const handleKeyPress = (e: React.KeyboardEvent, engine?: SearchEngine) => {
    if (e.key === "Enter") {
      if (engine) {
        handleSearch(engine)
      } else {
        ;(e.target as HTMLInputElement).blur()
      }
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isMobile) {
      const currentScrollY = window.scrollY
      setTimeout(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" })
      }, 0)
      setTimeout(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" })
      }, 300)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top,1rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search engines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top,1rem)]">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-8">
            Easy<span className="text-primary">Search</span>
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Enter your search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                onFocus={handleInputFocus}
                className="pl-16 pr-16 py-6 text-xl bg-input border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
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
              className="h-16 bg-card hover:bg-gray-50 border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary"
            >
              <span className="text-sm font-medium text-card-foreground">{engine.name}</span>
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
