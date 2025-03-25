import { Skill } from './SkillTypes';
import { Node, NodeProps, Position } from '@xyflow/react';

export interface SkillNodeDataContent {
  skill: Skill;
  skills: Skill[];
  onUpgrade: () => void;
  onDowngrade?: () => void;
  isUpgradeable: boolean;
  playerLevel: number;
  availablePoints: number;
  hasIncomingConnections: boolean;
}

export interface SkillNodeData extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    skill: Skill;
    skills: Skill[];
    onUpgrade: () => void;
    onDowngrade?: () => void;
    isUpgradeable: boolean;
    playerLevel: number;
    availablePoints: number;
    hasIncomingConnections: boolean;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
  draggable?: boolean;
  width?: number;
  height?: number;
  dragHandle?: string;
  parentNode?: string;
  [key: string]: unknown;
}

export type SkillNodeProps = NodeProps<SkillNodeData>;