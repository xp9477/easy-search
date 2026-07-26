'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'

const ORDER = ['system', 'light', 'dark'] as const
type ThemeOption = (typeof ORDER)[number]

const LABEL: Record<ThemeOption, string> = {
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
}

const ICON = {
    system: Monitor,
    light: Sun,
    dark: Moon,
}

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // 服务端渲染时拿不到实际主题，挂载前渲染占位，避免 hydration 不一致
    useEffect(() => setMounted(true), [])

    const current: ThemeOption =
        mounted && (ORDER as readonly string[]).includes(theme ?? '')
            ? (theme as ThemeOption)
            : 'system'
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]
    const Icon = ICON[current]

    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            aria-label={`主题：${LABEL[current]}，点击切换为${LABEL[next]}`}
            title={`主题：${LABEL[current]}`}
            className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {mounted ? <Icon className="h-5 w-5" /> : <span className="h-5 w-5" />}
        </button>
    )
}
