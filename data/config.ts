import searchEnginesData from './search-engines.json'



// 搜索引擎数据
export const searchEngines = searchEnginesData

export type SearchEngine = {
    name: string
    url: string
    url_scheme?: string
}
