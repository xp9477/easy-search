import searchEnginesData from './search-engines.json'



// 搜索引擎数据
export const searchEngines = searchEnginesData as SearchEngine[]

export type SearchEngine = {
    name: string
    url: string
    url_scheme?: string
    category?: '搜索' | 'AI' | '娱乐' | '购物'
    /**
     * How to pass the search query:
     * - url (default): embed into url / url_scheme via {query}
     * - clipboard: copy query to clipboard then open the site
     *   (for sites like DeepSeek that do not support URL prefill)
     */
    prefill?: 'url' | 'clipboard'
}
