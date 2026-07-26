'use client'

import type React from 'react'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SearchEngineGrid from '@/components/search-engine-grid'
import { DEFAULT_CATEGORY, getCategories, type Category, type SearchEngine } from '@/data/config'

const MOBILE_UA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

// 新标签页打开，并切断 window.opener（防止反向标签劫持）
function openExternal(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
}

interface EasySearchClientProps {
    searchEngines: SearchEngine[]
}

export default function EasySearchClient({ searchEngines }: EasySearchClientProps) {
    const categories = useMemo(() => getCategories(searchEngines), [searchEngines])

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<Category>(DEFAULT_CATEGORY)
    const [isMobile, setIsMobile] = useState(false)
    const [toast, setToast] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showToast = (message: string) => {
        setToast(message)
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current)
        }
        toastTimerRef.current = setTimeout(() => {
            setToast(null)
            toastTimerRef.current = null
        }, 3200)
    }

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current)
            }
        }
    }, [])

    // Layout effect to check for mobile device
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || ''
        setIsMobile(MOBILE_UA.test(userAgent))
    }, [])

    // Handle initial search params
    // 注意：searchParams.get() 已经做过一次解码，不要再 decodeURIComponent，
    // 否则 ?keyword=100%25 之类的输入会抛 URIError。
    useEffect(() => {
        const keywordParam = searchParams.get('keyword')
        if (keywordParam) {
            setSearchQuery(keywordParam)
        }
    }, [searchParams])

    // Autofocus on desktop only：移动端自动聚焦会强行弹出键盘并顶起页面
    useEffect(() => {
        if (isMobile) return
        searchInputRef.current?.focus()
    }, [isMobile])

    const handleSearch = async (engine: SearchEngine) => {
        const query = searchQuery.trim()
        if (!query) {
            searchInputRef.current?.focus()
            return
        }

        // Mobile app deep links can carry the query natively
        if (isMobile && engine.url_scheme) {
            openExternal(engine.url_scheme.replace('{query}', encodeURIComponent(query)))
            return
        }

        // Sites without URL prefill (e.g. DeepSeek web): open + copy for paste
        if (engine.prefill === 'clipboard') {
            const fallbackCopy = () => {
                try {
                    const textarea = document.createElement('textarea')
                    textarea.value = query
                    textarea.setAttribute('readonly', '')
                    textarea.style.position = 'fixed'
                    textarea.style.left = '-9999px'
                    document.body.appendChild(textarea)
                    textarea.select()
                    const ok = document.execCommand('copy')
                    document.body.removeChild(textarea)
                    return ok
                } catch {
                    return false
                }
            }

            // Start copy while still in the user-gesture chain
            const copyPromise =
                typeof navigator.clipboard?.writeText === 'function'
                    ? navigator.clipboard.writeText(query).then(() => true).catch(() => fallbackCopy())
                    : Promise.resolve(fallbackCopy())

            // Open synchronously so popup blockers do not fire
            openExternal(
                engine.url.includes('{query}')
                    ? engine.url.replace('{query}', encodeURIComponent(query))
                    : engine.url
            )

            const copied = await copyPromise
            showToast(
                copied
                    ? '已复制到剪贴板，在输入框粘贴即可（Ctrl+V / ⌘V）'
                    : '无法自动复制，请手动粘贴搜索内容'
            )
            return
        }

        openExternal(engine.url.replace('{query}', encodeURIComponent(query)))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
    }

    const handleInputFocus = () => {
        if (!isMobile) return
        // iOS 聚焦时会把页面顶上去，聚焦后把滚动位置还原
        const currentScrollY = window.scrollY
        const restore = () => window.scrollTo({ top: currentScrollY, behavior: 'instant' })
        setTimeout(restore, 0)
        setTimeout(restore, 300)
    }

    const clearSearch = () => {
        setSearchQuery('')
        searchInputRef.current?.focus()
    }

    const filteredEngines = useMemo(
        () =>
            searchEngines.filter(
                (engine) =>
                    (engine.category ?? DEFAULT_CATEGORY) === selectedCategory
            ),
        [searchEngines, selectedCategory]
    )

    return (
        <main className="min-h-screen bg-background flex flex-col items-center p-4 pt-24 pb-12">
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
                                aria-label="搜索关键词"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={handleInputFocus}
                                className="pl-16 pr-16 py-6 text-xl bg-input border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
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
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={selectedCategory === category}
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

                {/* Search Engine Grid */}
                <SearchEngineGrid engines={filteredEngines} onSearch={handleSearch} searchQuery={searchQuery} />

                {/* Footer */}
                <div className="text-center mt-16">
                    <p className="text-muted-foreground text-sm">Search across multiple platforms with one click</p>
                </div>
            </div>

            <div role="status" aria-live="polite" className="sr-only">
                {toast}
            </div>
            {toast && (
                <div
                    aria-hidden="true"
                    className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg"
                >
                    {toast}
                </div>
            )}
        </main>
    )
}
