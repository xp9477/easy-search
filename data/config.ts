import searchEnginesData from './search-engines.json'

/**
 * 分类的唯一来源：新增分类只需改这里 + search-engines.json，
 * 页面组件不需要再同步一份硬编码列表。
 */
export const CATEGORIES = ['搜索', 'AI', '娱乐', '购物'] as const

export type Category = (typeof CATEGORIES)[number]

/** 没有显式 category 的条目归入这一类 */
export const DEFAULT_CATEGORY: Category = '搜索'

export type SearchEngine = {
    name: string
    url: string
    url_scheme?: string
    category?: Category
    /**
     * How to pass the search query:
     * - url (default): embed into url / url_scheme via {query}
     * - clipboard: copy query to clipboard then open the site
     *   (for sites like DeepSeek that do not support URL prefill)
     */
    prefill?: 'url' | 'clipboard'
}

// 搜索引擎数据
export const searchEngines = searchEnginesData as SearchEngine[]

/** 按 CATEGORIES 的顺序返回实际有条目的分类，避免出现空标签页 */
export function getCategories(engines: SearchEngine[]): Category[] {
    const used = new Set(engines.map((engine) => engine.category ?? DEFAULT_CATEGORY))
    return CATEGORIES.filter((category) => used.has(category))
}
