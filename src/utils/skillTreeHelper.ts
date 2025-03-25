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
    
    // Create a graph of skill dependencies
    const skillGraph = new Map<string, string[]>();
    connections.forEach(conn => {
      if (!skillGraph.has(conn.source)) {
        skillGraph.set(conn.source, []);
      }
      skillGraph.get(conn.source)!.push(conn.target);
    });
  
    // Find root skills (skills with no dependencies)
    const rootSkills = skills.filter(skill => 
      !connections.some(conn => conn.target === skill.id)
    );
  
    // Recursive layout function
    const positionSkills = (skill: Skill, depth: number, column: number): { x: number, y: number } => {
      const baseX = 500;  // Center X
      const baseY = 200;  // Starting Y
      const horizontalSpacing = 250;
      const verticalSpacing = 200;
  
      // Calculate x position based on column
      const x = baseX + (column - 1) * horizontalSpacing;
      
      // Calculate y position based on depth
      const y = baseY + depth * verticalSpacing;
  
      // Find children skills
      const children = skills.filter(s => 
        connections.some(conn => 
          conn.source === skill.id && conn.target === s.id
        )
      );
  
      // If no children, return simple position
      if (children.length === 0) {
        return { x, y };
      }
  
      // Distribute children horizontally
      children.forEach((child, index) => {
        const childColumn = column + (index - (children.length - 1) / 2);
        layout.push(positionSkills(child, depth + 1, childColumn));
      });
  
      return { x, y };
    };
  
    // Position root skills
    rootSkills.forEach((rootSkill, index) => {
      const column = index - (rootSkills.length - 1) / 2;
      layout.push(positionSkills(rootSkill, 0, column));
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