import { Suspense } from 'react'
import { searchEngines } from '@/data/config'
import EasySearchClient from './easy-search-client'

export default function EasySearchPage() {
  // 服务端组件：在构建时准备数据，通过 props 传递给客户端组件
  // 这样搜索引擎数据会被预渲染到 HTML 中，无需客户端加载
  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <EasySearchClient searchEngines={searchEngines} />
    </Suspense>
  )
}
