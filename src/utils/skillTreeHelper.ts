import { Skill, SkillConnection } from '../types/SkillTypes';

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

export const calculateSkillTreeLayout = (skills: Skill[], connections: SkillConnection[]): { x: number, y: number }[] => {
  const layout: { x: number, y: number }[] = [];
  
  const basePositions = [
    { x: 250, y: 100 },   // Left start
    { x: 500, y: 100 },   // Middle start
    { x: 750, y: 100 }    // Right start
  ];

  const verticalSpacing = 250;
  const horizontalSpacing = 250;

  basePositions.forEach((basePos, index) => {
    layout.push({ x: basePos.x, y: basePos.y });

    const relevantSkills = skills.filter(skill => 
      connections.some(conn => 
        conn.source === skills[index].id && conn.target === skill.id
      )
    );

    relevantSkills.forEach((skill, subIndex) => {
      const isLeftSide = index < 1;
      const isRightSide = index > 1;

      const x = isLeftSide 
        ? basePos.x - horizontalSpacing
        : isRightSide 
        ? basePos.x + horizontalSpacing 
        : basePos.x;

      const y = basePos.y + verticalSpacing * (subIndex + 1);

      layout.push({ x, y });

      // Add additional level for some skills
      const additionalSkills = skills.filter(s => 
        connections.some(conn => 
          conn.source === skill.id && conn.target === s.id
        )
      );

      additionalSkills.forEach((_additionalSkill, additionalIndex) => {
        const additionalX = x + (additionalIndex % 2 === 0 ? -horizontalSpacing/2 : horizontalSpacing/2);
        const additionalY = y + verticalSpacing;

        layout.push({ x: additionalX, y: additionalY });
      });
    });
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