import React from 'react';
import { SkillTree } from './components';
import { Sword, Shield, Crosshair } from '@phosphor-icons/react';

const App: React.FC = () => {
	const skillTreeData = {
		id: 'combat-skills',
		name: 'Combat Mastery',
		description: 'Unlock and improve your combat abilities',
		playerLevel: 10,
		availablePoints: 15,
		skills: [
			{
				id: 'sword-mastery',
				name: 'Sword Mastery',
				description: 'Improve sword handling and damage',
				icon: Sword,
				level: 0,
				maxLevel: 5,
				cost: 3,
				isUnlocked: false,
			},
			{
				id: 'shield-defense',
				name: 'Shield Defense',
				description: 'Enhance defensive capabilities',
				icon: Shield,
				level: 0,
				maxLevel: 3,
				cost: 2,
				requiredSkills: ['sword-mastery'],
				isUnlocked: false,
			},
			{
				id: 'precision-strike',
				name: 'Precision Strike',
				description: 'Increase critical hit chance',
				icon: Crosshair,
				level: 0,
				maxLevel: 4,
				cost: 4,
				requiredSkills: ['sword-mastery', 'shield-defense'],
				isUnlocked: false,
			},
		],
		connections: [
			{ source: 'sword-mastery', target: 'shield-defense' },
			{ source: 'shield-defense', target: 'precision-strike' },
		],
	};

	const handleSkillUpgrade = (skillId: string) => {
		console.log(`Skill ${skillId} upgraded`);
	};

	return <SkillTree data={skillTreeData} onSkillUpgrade={handleSkillUpgrade} />;
};

export default App;
