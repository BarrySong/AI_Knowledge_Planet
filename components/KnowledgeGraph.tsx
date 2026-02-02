
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ConceptNode } from '../types';
import { KNOWLEDGE_DATA, COLORS } from '../constants';

interface Props {
  onNodeClick: (node: ConceptNode) => void;
  selectedNodeId?: string;
}

const KnowledgeGraph: React.FC<Props> = ({ onNodeClick, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<SVGGElement>(null);

  // 1. 初始化图形 Effect：只在组件挂载和 onNodeClick 改变时运行
  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const tooltip = d3.select(tooltipRef.current);

    const mainSvg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // 清除内容
    mainSvg.selectAll("*").remove();

    const container = mainSvg.append('g');
    // @ts-ignore
    containerRef.current = container.node();

    // 缩放配置：仅保留鼠标滚轮/手势缩放
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    mainSvg.call(zoomBehavior);

    // 仿真力场
    const simulation = d3.forceSimulation<any>(KNOWLEDGE_DATA.nodes)
      .force('link', d3.forceLink<any, any>(KNOWLEDGE_DATA.links)
        .id((d: any) => d.id)
        .distance((d: any) => 120 + (d.source.level + d.target.level) * 30))
      .force('charge', d3.forceManyBody().strength((d: any) => -1500 - (3 - d.level) * 500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => 75 + (3 - d.level) * 15));

    // 连线
    const link = container.append('g')
      .selectAll('line')
      .data(KNOWLEDGE_DATA.links)
      .enter().append('line')
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d: any) => d.label === '核心驱动' ? '0' : '4,4');

    // 连线文字
    const linkLabels = container.append('g')
      .selectAll('text')
      .data(KNOWLEDGE_DATA.links)
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(d => d.label);

    // 节点组
    const node = container.append('g')
      .selectAll('g')
      .data(KNOWLEDGE_DATA.nodes)
      .enter().append('g')
      .attr('class', 'concept-node')
      .attr('id', d => `node-group-${d.id}`)
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d as ConceptNode);
      })
      .on('mouseover', (event, d: any) => {
        tooltip
          .style('opacity', 1)
          .html(`
            <div class="font-bold text-lg mb-1" style="color: ${COLORS[d.category as keyof typeof COLORS]}">${d.label}</div>
            <div class="text-sm text-gray-300 leading-snug">${d.summary}</div>
          `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 15) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .call(d3.drag<SVGGElement, any>()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }));

    // 背景发光
    node.append('circle')
      .attr('r', d => 35 + (4 - d.level) * 12)
      .attr('fill', d => COLORS[d.category as keyof typeof COLORS])
      .attr('opacity', d => 0.15 - (d.level * 0.03));

    // 星球主体
    node.append('circle')
      .attr('class', 'core-circle')
      .attr('r', d => 20 + (4 - d.level) * 8)
      .attr('fill', d => COLORS[d.category as keyof typeof COLORS])
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('style', d => d.level === 0 ? 'filter: drop-shadow(0 0 15px rgba(255,107,107,0.8))' : '');

    // 标签文字 (已移除背景 rect)
    node.append('text')
      .text(d => d.label)
      .attr('y', d => 54 + (4 - d.level) * 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', d => (16 - d.level * 2) + 'px')
      .attr('style', 'text-shadow: 0px 2px 4px rgba(0,0,0,0.8); font-weight: 500;')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      linkLabels
        .attr('x', d => ((d.source as any).x + (d.target as any).x) / 2)
        .attr('y', d => ((d.source as any).y + (d.target as any).y) / 2 - 5);

      node.attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    return () => simulation.stop();
  }, [onNodeClick]);

  // 2. 专门处理选中态更新的 Effect：不破坏主图，仅更新 DOM 样式
  useEffect(() => {
    if (!containerRef.current) return;
    const container = d3.select(containerRef.current);

    // 首先重置所有节点的边框
    container.selectAll('.core-circle')
      .transition().duration(200)
      .attr('stroke-width', 1.5);

    // 如果有选中的节点，单独加粗其边框
    if (selectedNodeId) {
      container.select(`#node-group-${selectedNodeId} .core-circle`)
        .transition().duration(200)
        .attr('stroke-width', 4.5);
    }
  }, [selectedNodeId]);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div 
        ref={tooltipRef} 
        className="fixed pointer-events-none opacity-0 bg-gray-900/95 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl z-[100] transition-opacity duration-200 max-w-xs"
      />
    </div>
  );
};

export default KnowledgeGraph;
