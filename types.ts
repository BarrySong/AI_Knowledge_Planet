
export interface ConceptNode {
  id: string;
  label: string;
  category: 'core' | 'tech' | 'bridge' | 'future';
  summary: string;
  analogy: string;
  detail: string;
  importance: string;
  level: number; // 0 for root, 1 for main concepts, etc.
  usageExample?: string; // 可选的使用示例或流程说明
}

export interface ConceptLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: ConceptNode[];
  links: ConceptLink[];
}
