'use client'

import { Button } from '@/components/ui/button'
import type { SearchEngine } from '@/data/config'

interface SearchEngineGridProps {
    engines: SearchEngine[]
    onSearch: (engine: SearchEngine) => void | Promise<void>
    searchQuery: string
}

export default function SearchEngineGrid({ engines, onSearch, searchQuery }: SearchEngineGridProps) {
    // 注意：不要额外监听 Enter 的 keydown —— 原生 <button> 按 Enter 本身就会派发 click，
    // 两个处理器都调用 onSearch 会打开两个标签页。
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {engines.map((engine) => (
                <Button
                    key={engine.name}
                    variant="outline"
                    onClick={() => onSearch(engine)}
                    disabled={!searchQuery.trim()}
                    title={`用 ${engine.name} 搜索`}
                    className="h-16 bg-card hover:bg-accent border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:hover:scale-100"
                >
                    <span className="text-sm font-medium text-card-foreground">{engine.name}</span>
                </Button>
            ))}
        </div>
    )
}
