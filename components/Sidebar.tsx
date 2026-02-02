
import React, { useState, useEffect, useMemo } from 'react';
import { ConceptNode } from '../types';
import { askGemini, CURRENT_MODEL } from '../services/gemini';
import { COLORS, KNOWLEDGE_DATA } from '../constants';

interface Props {
  node: ConceptNode | null;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ node, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const neighbors = useMemo(() => {
    if (!node) return [];
    return KNOWLEDGE_DATA.links
      .filter(link => link.source === node.id || link.target === node.id)
      .map(link => {
        const isSource = link.source === node.id;
        const otherNodeId = isSource ? link.target : link.source;
        const otherNode = KNOWLEDGE_DATA.nodes.find(n => n.id === otherNodeId);
        return {
          node: otherNode,
          relation: link.label,
          direction: isSource ? 'out' : 'in'
        };
      })
      .filter(item => item.node !== undefined);
  }, [node]);

  useEffect(() => {
    setAnswer('');
    setQuestion('');
  }, [node]);

  if (!node) return null;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await askGemini(node.label, question);
    setAnswer(res.text || "出错了...");
    setLoading(false);
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 bg-opacity-95 shadow-2xl border-l border-gray-700 transition-transform duration-300 transform z-50 flex flex-col no-scrollbar`}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: COLORS[node.category as keyof typeof COLORS] }}
          ></span>
          {node.label}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <section>
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">一句话概括</h3>
          <p className="text-gray-200 text-lg leading-relaxed">{node.summary}</p>
        </section>

        <section className="bg-blue-900 bg-opacity-20 p-4 rounded-xl border border-blue-500 border-opacity-30">
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-lightbulb"></i> 通俗比喻
          </h3>
          <p className="text-blue-100 italic">“{node.analogy}”</p>
        </section>

        {node.usageExample && (
          <section className="bg-emerald-900 bg-opacity-20 p-4 rounded-xl border border-emerald-500 border-opacity-30">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i className="fas fa-play-circle"></i> 实战演示
            </h3>
            <div className="text-emerald-100 text-sm leading-relaxed whitespace-pre-wrap">
              {node.usageExample}
            </div>
          </section>
        )}

        {neighbors.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i className="fas fa-project-diagram"></i> 星系关联
            </h3>
            <div className="space-y-3">
              {neighbors.map((item, idx) => (
                <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      {item.direction === 'out' ? '输出至' : '来源于'}
                    </span>
                    <span className="text-xs text-orange-300/80 font-mono italic">{item.relation}</span>
                  </div>
                  <div className="text-sm text-gray-100 flex items-center gap-2 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: COLORS[item.node!.category as keyof typeof COLORS] }}
                    ></div>
                    <span className="font-semibold">{item.node!.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">深度解读</h3>
          <p className="text-gray-300 leading-relaxed">{node.detail}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">为什么重要？</h3>
          <p className="text-gray-300">{node.importance}</p>
        </section>

        <div className="pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-robot"></i> 还有疑问？问问 AI 助教
            </h3>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
              驱动模型: {CURRENT_MODEL}
            </span>
          </div>
          <div className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`关于 ${node.label}，你还想知道什么？例如：它和我们平时用的 App 有什么区别？`}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              {loading ? '正在思考中...' : '提交问题'}
            </button>
          </div>

          {answer && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in relative">
              <div className="absolute top-2 right-2 text-[10px] text-gray-500 italic">由 {CURRENT_MODEL} 生成</div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mt-2">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
