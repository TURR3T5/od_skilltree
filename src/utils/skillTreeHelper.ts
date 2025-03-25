import { Skill, SkillConnection } from '../types/SkillTypes';
import dagre from '@dagrejs/dagre';

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

export const calculateSkillTreeLayout = (
  skills: Skill[], 
  connections: SkillConnection[]
): { x: number; y: number }[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  const nodeWidth = 100;
  const nodeHeight = 100;

  skills.forEach((skill) => {
    dagreGraph.setNode(skill.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  connections.forEach((connection) => {
    dagreGraph.setEdge(connection.source, connection.target);
  });

  dagre.layout(dagreGraph);

  return skills.map((skill) => {
    const nodeWithPosition = dagreGraph.node(skill.id);
    return {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });
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