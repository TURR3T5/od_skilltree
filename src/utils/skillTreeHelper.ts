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
  
  // Define core categories and their positions
  const categories = [
    { name: 'core', skills: ['sword-mastery', 'physical-conditioning', 'fire-magic'], x: 500, y: 300 },
    { name: 'combat', skills: ['shield-defense', 'precision-strike', 'dual-wielding', 'master-archer'], x: 300, y: 500 },
    { name: 'magic', skills: ['water-magic', 'wind-magic', 'lightning-bolt', 'elemental-mastery'], x: 700, y: 500 },
    { name: 'support', skills: ['tactical-awareness', 'leadership', 'wind-slash'], x: 500, y: 700 }
  ];

  // Calculate positions based on category
  skills.forEach(skill => {
    let position = { x: 500, y: 300 }; // Default center position

    for (const category of categories) {
      if (category.skills.includes(skill.id)) {
        // Spread skills within their category in a radial pattern
        const categorySkills = category.skills;
        const index = categorySkills.indexOf(skill.id);
        const angle = (index / categorySkills.length) * Math.PI * 1.6 - Math.PI * 0.8;
        const radius = categorySkills.length > 1 ? 200 : 0;

        position = {
          x: category.x + Math.cos(angle) * radius,
          y: category.y + Math.sin(angle) * radius
        };
        break;
      }
    }

    layout.push(position);
  });

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