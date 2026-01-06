import searchEnginesData from './search-engines.json'

// 缓存配置
export const CACHE_CONFIG = {
    KEY: 'easysearch_engines_cache',
    EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7天（优化：从24小时改为7天）
    VERSION: '1.0.3', // 🎯 版本号和数据文件放在一起，方便维护
}

// 搜索引擎数据
export const searchEngines = searchEnginesData

export type SearchEngine = {
    name: string
    url: string
    url_scheme?: string
}
