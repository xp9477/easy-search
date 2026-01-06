'use client'

import { Button } from '@/components/ui/button'
import type { SearchEngine } from '@/data/config'

interface SearchEngineGridProps {
    engines: SearchEngine[]
    onSearch: (engine: SearchEngine) => void
    searchQuery: string
}

export default function SearchEngineGrid({ engines, onSearch, searchQuery }: SearchEngineGridProps) {
    const handleKeyPress = (e: React.KeyboardEvent, engine: SearchEngine) => {
        if (e.key === 'Enter') {
            onSearch(engine)
        }
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {engines.map((engine, index) => (
                <Button
                    key={index}
                    variant="outline"
                    onClick={() => onSearch(engine)}
                    onKeyDown={(e) => handleKeyPress(e, engine)}
                    disabled={!searchQuery.trim()}
                    className="h-16 bg-card hover:bg-accent border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:hover:scale-100"
                >
                    <span className="text-sm font-medium text-card-foreground">{engine.name}</span>
                </Button>
            ))}
        </div>
    )
}
