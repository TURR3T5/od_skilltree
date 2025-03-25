import { Skill } from '../types/SkillTypes';

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

export const calculateSkillTreeLayout = (skills: Skill[]): { x: number, y: number }[] => {
  const layout: { x: number, y: number }[] = [];
  
  const categorized = {
    combat: skills.filter(s => ['sword-mastery', 'shield-defense', 'precision-strike', 'dual-wielding', 'master-archer'].includes(s.id)),
    magic: skills.filter(s => ['fire-magic', 'water-magic', 'wind-magic', 'lightning-bolt', 'elemental-mastery'].includes(s.id)),
    support: skills.filter(s => ['physical-conditioning', 'tactical-awareness', 'leadership'].includes(s.id)),
    hybrid: skills.filter(s => ['wind-slash'].includes(s.id))
  };
  
  for (const skill of skills) {
    let x = 0;
    let y = 0;
    
    if (categorized.combat.includes(skill)) {
      if (skill.id === 'sword-mastery') {
        x = 300;
        y = 100;
      } else if (skill.id === 'shield-defense') {
        x = 150;
        y = 250;
      } else if (skill.id === 'precision-strike') {
        x = 450;
        y = 250;
      } else if (skill.id === 'master-archer') {
        x = 600;
        y = 400;
      } else if (skill.id === 'dual-wielding') {
        x = 200;
        y = 400;
      }
    }
    else if (categorized.magic.includes(skill)) {
      if (skill.id === 'fire-magic') {
        x = 700;
        y = 100;
      } else if (skill.id === 'water-magic') {
        x = 900;
        y = 100;
      } else if (skill.id === 'lightning-bolt') {
        x = 700;
        y = 250;
      } else if (skill.id === 'elemental-mastery') {
        x = 800;
        y = 400;
      } else if (skill.id === 'wind-magic') {
        x = 500;
        y = 100;
      }
    }
    else if (categorized.support.includes(skill)) {
      if (skill.id === 'physical-conditioning') {
        x = 100;
        y = 100;
      } else if (skill.id === 'tactical-awareness') {
        x = 100;
        y = 250;
      } else if (skill.id === 'leadership') {
        x = 100;
        y = 400;
      }
    }
    else if (categorized.hybrid.includes(skill)) {
      if (skill.id === 'wind-slash') {
        x = 400;
        y = 400;
      }
    }
    else {
      const index = skills.indexOf(skill);
      x = ((index % 5) * 200) + 100;
      y = (Math.floor(index / 5) * 150) + 100;
    }
    
    layout.push({ x, y });
  }
  
  return layout;
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