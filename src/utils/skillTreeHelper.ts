import { Skill, SkillConnection } from '../types/SkillTypes';
import dagre from '@dagrejs/dagre';
import { SkillNodeData } from '../types/SkillNodeData';
import { Edge, MarkerType, Position, Node } from '@xyflow/react';

export const canUpgradeSkill = (
  skill: Skill, 
  playerLevel: number, 
  availablePoints: number
): boolean => {
  if (skill.level >= skill.maxLevel) return false;

  const levelRequirement = skill.level * 5;
  if (playerLevel < levelRequirement) return false;

  if (availablePoints < skill.cost) return false;

  return true;
};

export const layoutSkillTree = (
  nodes: SkillNodeData[], 
  edges: Edge[], 
  direction: 'TB' | 'LR' = 'TB'
): { nodes: SkillNodeData[], edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  
  dagreGraph.setGraph({ 
    rankdir: direction, 
    nodesep: 150, 
    ranksep: 150, 
    align: 'UL',
    marginx: 50,
    marginy: 50,
  });

  const nodeWidth = 120;
  const nodeHeight = 120;

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Auto-arrange the graph
  dagre.layout(dagreGraph);

  // Update node positions based on dagre calculations
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const isSkillUnlockable = (
  skill: Skill, 
  skills: Skill[], 
  playerLevel: number, 
  availablePoints: number
): boolean => {
  if (skill.isUnlocked) {
    return canUpgradeSkill(skill, playerLevel, availablePoints);
  }
  
  if (skill.requiredSkills) {
    const requiredSkillsUnlocked = skill.requiredSkills.every(
      requiredSkillId => skills.find(s => s.id === requiredSkillId)?.isUnlocked
    );
    
    if (!requiredSkillsUnlocked) return false;
  }

  return canUpgradeSkill(skill, playerLevel, availablePoints);
};

export const calculateTotalSpentPoints = (skills: Skill[]): number => {
  return skills.reduce((total, skill) => total + (skill.cost * skill.level), 0);
};

export const findDependentSkills = (
  skillId: string, 
  skills: Skill[]
): Skill[] => {
  return skills.filter(
    skill => skill.requiredSkills?.includes(skillId) && skill.isUnlocked
  );
};

export const getSkillLevelRequirement = (skill: Skill): number => {
  return skill.level * 5;
};

export const createSkillTreeEdges = (
  connections: SkillConnection[], 
  skills: Skill[], 
  theme: any
): Edge[] => {
  return connections.map((connection) => {
    const sourceSkill = skills.find((s) => s.id === connection.source);
    const isPathUnlocked = sourceSkill?.isUnlocked || false;

    return {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: 'smoothstep',
      animated: isPathUnlocked,
      style: {
        stroke: isPathUnlocked ? theme.colors.blue[6] : theme.colors.gray[7],
        strokeWidth: 3,
        opacity: isPathUnlocked ? 1 : 0.5,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isPathUnlocked ? theme.colors.blue[6] : theme.colors.gray[7],
        width: 20,
        height: 20,
      },
    };
  });
};

export const getNodesWithIncomingConnections = (
  nodes: Node[], 
  connections: SkillConnection[]
): string[] => {
  return nodes
    .filter(node => connections.some(conn => conn.target === node.id))
    .map(node => node.id);
};

export const getRootNodes = (
  nodes: Node[], 
  connections: SkillConnection[]
): string[] => {
  return nodes
    .filter(node => !connections.some(conn => conn.target === node.id))
    .map(node => node.id);
};

export const getNodeConnectionState = (
  nodeId: string,
  connections: SkillConnection[]
): { hasOutgoing: boolean; hasIncoming: boolean } => {
  return {
    hasOutgoing: connections.some(conn => conn.source === nodeId),
    hasIncoming: connections.some(conn => conn.target === nodeId)
  };
};