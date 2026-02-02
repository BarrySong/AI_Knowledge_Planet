
import React, { useState, useCallback } from 'react';
import KnowledgeGraph from './components/KnowledgeGraph';
import Sidebar from './components/Sidebar';
import { ConceptNode } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // 使用 useCallback 确保函数引用稳定，防止 KnowledgeGraph 重新初始化
  const handleNodeClick = useCallback((node: ConceptNode) => {
    setSelectedNode(node);
    setShowWelcome(false);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Title Header */}
      <header className="absolute top-0 left-0 p-6 z-10 w-full bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          AI 知识星系
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base hidden md:block">
          点击星球探索 AI 世界的奥秘，让复杂技术变得像常识一样简单。
        </p>
      </header>

      {/* Main Graph View */}
      <main className="w-full h-full">
        <KnowledgeGraph onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />
      </main>

      {/* Side Info Panel */}
      <Sidebar 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />

      {/* Welcome Modal / Overlay */}
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-700 max-w-lg mx-4 text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <i className="fas fa-rocket text-3xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold mb-4">欢迎来到 AI 知识星系</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              这里是为你准备的“AI 入门地图”。我们将大模型、LLM、MCP 等深奥词汇化作一个个发光的星球。点击它们，查看生动的比喻，还可以通过 AI 助教进行一对一互动。
            </p>
            <button 
              onClick={() => setShowWelcome(false)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              开启探索之旅
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 hidden md:block">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">知识图例</h4>
        <div className="space-y-2">
          {Object.entries(COLORS).map(([key, color]) => {
            const labelMap: Record<string, string> = {
              core: '核心概念',
              tech: '技术支撑',
              bridge: '连接协议',
              future: '未来应用'
            };
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-xs text-gray-300">{labelMap[key]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
