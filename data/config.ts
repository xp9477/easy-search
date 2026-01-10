import searchEnginesData from './search-engines.json'



// 搜索引擎数据
export const searchEngines = searchEnginesData as SearchEngine[]

export type SearchEngine = {
    name: string
    url: string
    url_scheme?: string
    category?: '搜索' | 'AI' | '娱乐' | '购物'
}
