'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { type SearchEngine } from '@/data/config'

// 懒加载搜索引擎网格组件
const SearchEngineGrid = dynamic(() => import('@/components/search-engine-grid'), {
    loading: () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="h-16 bg-card/50 border border-border rounded-lg animate-pulse"
                />
            ))}
        </div>
    ),
    ssr: true,
})

interface EasySearchClientProps {
    searchEngines: SearchEngine[]
}

export default function EasySearchClient({ searchEngines: initialEngines }: EasySearchClientProps) {
    const CATEGORIES = ['搜索', 'AI', '娱乐', '购物'] as const
    type Category = typeof CATEGORIES[number]

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<Category>('搜索')
    const [searchEngines, setSearchEngines] = useState<SearchEngine[]>(initialEngines)
    const [isMobile, setIsMobile] = useState(false)
    const searchParams = useSearchParams()
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Layout effect to check for mobile device
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
            setIsMobile(mobileRegex.test(userAgent.toLowerCase()))
        }
        checkMobile()
    }, [])

    // Handle initial search params and focus
    useEffect(() => {
        const keywordParam = searchParams.get('keyword')
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
        const searchUrl = targetUrl.replace('{query}', encodeURIComponent(searchQuery.trim()))
        window.open(searchUrl, '_blank')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            ; (e.target as HTMLInputElement).blur()
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isMobile) {
            const currentScrollY = window.scrollY
            setTimeout(() => {
                window.scrollTo({ top: currentScrollY, behavior: 'instant' })
            }, 0)
            setTimeout(() => {
                window.scrollTo({ top: currentScrollY, behavior: 'instant' })
            }, 300)
        }
    }

    const clearSearch = () => {
        setSearchQuery('')
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }

    const filteredEngines = searchEngines.filter(engine =>
        engine.category === selectedCategory || (!engine.category && selectedCategory === '搜索')
    )

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top,1rem)]">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-foreground mb-8">
                        Easy<span className="text-primary">Search</span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-3xl mx-auto mb-6">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                            <Input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Enter your search query..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
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

                    {/* Category Tabs */}
                    <div className="flex justify-center gap-6 mb-6">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`relative pb-2 text-sm font-medium transition-colors duration-200 ${selectedCategory === category
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {category}
                                {selectedCategory === category && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Engine Grid - 懒加载 */}
                <SearchEngineGrid engines={filteredEngines} onSearch={handleSearch} searchQuery={searchQuery} />

                {/* Footer */}
                <div className="text-center mt-16">
                    <p className="text-muted-foreground text-sm">Search across multiple platforms with one click</p>
                </div>
            </div>
        </div>
    )
}
