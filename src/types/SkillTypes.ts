import { IconProps } from '@phosphor-icons/react';
import React from 'react';

export interface SkillConnection {
  source: string;
  target: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  level: number;
  maxLevel: number;
  cost: number;
  requiredSkills?: string[];
  isUnlocked: boolean;
}

export interface SkillTreeData {
  id: string;
  name: string;
  description: string;
  playerLevel: number;
  availablePoints: number;
  skills: Skill[];
  connections: SkillConnection[];
}

export interface SkillTreeProps {
  data: SkillTreeData;
  onSkillUpgrade: (skillId: string) => void;
  onSkillDowngrade?: (skillId: string) => void;
}

export interface SkillNodeProps {
  skill: Skill;
  onUpgrade: () => void;
  onDowngrade?: () => void;
  isUpgradeable: boolean;
  playerLevel: number;
  availablePoints: number;
}

export interface SkillUpgradeModalProps {
  skill: Skill;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  playerLevel: number;
  availablePoints: number;
}

export interface SkillTreeHeaderProps {
  name: string;
  playerLevel: number;
  availablePoints: number;
}