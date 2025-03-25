import React, { useState, useCallback } from 'react';
import { Container } from '@mantine/core';
import { SkillTree } from './components';
import { Shield, Fire, Barbell, Sword } from '@phosphor-icons/react';
import { SkillTreeData } from './types/SkillTypes';

const App: React.FC = () => {
	const [skillTreeData, setSkillTreeData] = useState<SkillTreeData>({
		id: 'combat-skills',
		name: 'Combat Mastery',
		description: 'Unlock and improve your combat abilities',
		playerLevel: 30,
		availablePoints: 55,
		skills: [
			{
				id: 'sword-mastery',
				name: 'Sword Mastery',
				description: 'Improve sword handling and damage. Increases physical damage by 10% per level.',
				icon: Sword,
				level: 0,
				maxLevel: 5,
				cost: 3,
				isUnlocked: false,
			},
			{
				id: 'fire-magic',
				name: 'Fire Magic',
				description: 'Harness the power of fire. Adds fire damage to attacks and unlocks fire spells.',
				icon: Fire,
				level: 0,
				maxLevel: 5,
				cost: 5,
				isUnlocked: false,
			},
			{
				id: 'physical-conditioning',
				name: 'Physical Conditioning',
				description: 'Improve physical attributes. +5 Strength and +5 Constitution per level.',
				icon: Barbell,
				level: 0,
				maxLevel: 5,
				cost: 2,
				isUnlocked: false,
			},
			{
				id: 'shield-defense',
				name: 'Shield Defense',
				description: 'Enhance defensive capabilities. +15% block chance per level.',
				icon: Shield,
				level: 0,
				maxLevel: 3,
				cost: 2,
				requiredSkills: ['tactical-awareness'],
				isUnlocked: false,
			},
		],
		connections: [
			{ source: 'sword-mastery', target: 'shield-defense' },
			{ source: 'sword-mastery', target: 'precision-strike' },
			{ source: 'precision-strike', target: 'master-archer' },
			{ source: 'fire-magic', target: 'lightning-bolt' },
			{ source: 'fire-magic', target: 'water-magic' },
			{ source: 'water-magic', target: 'elemental-mastery' },
			{ source: 'lightning-bolt', target: 'elemental-mastery' },
			{ source: 'physical-conditioning', target: 'tactical-awareness' },
			{ source: 'physical-conditioning', target: 'dual-wielding' },
			{ source: 'sword-mastery', target: 'dual-wielding' },
			{ source: 'tactical-awareness', target: 'leadership' },
		],
	});

	const handleSkillUpgrade = useCallback((skillId: string) => {
		setSkillTreeData((prevData) => {
			const skillToUpgrade = prevData.skills.find((s) => s.id === skillId);

			if (!skillToUpgrade || skillToUpgrade.level >= skillToUpgrade.maxLevel) {
				return prevData;
			}

			const newAvailablePoints = prevData.availablePoints - skillToUpgrade.cost;

			const updatedSkills = prevData.skills.map((skill) =>
				skill.id === skillId
					? {
							...skill,
							level: skill.level + 1,
							isUnlocked: true,
					  }
					: skill
			);

			return {
				...prevData,
				skills: updatedSkills,
				availablePoints: newAvailablePoints,
			};
		});
	}, []);

	const handleSkillDowngrade = useCallback((skillId: string) => {
		setSkillTreeData((prevData) => {
			const skillToDowngrade = prevData.skills.find((s) => s.id === skillId);

			if (!skillToDowngrade || skillToDowngrade.level <= 0) {
				return prevData;
			}

			const dependentSkills = prevData.skills.filter((s) => s.requiredSkills?.includes(skillId) && s.isUnlocked && s.level > 0);

			if (dependentSkills.length > 0 && skillToDowngrade.level <= 1) {
				// Can't downgrade if it would break dependencies
				return prevData;
			}

			const updatedSkills = prevData.skills.map((skill) =>
				skill.id === skillId
					? {
							...skill,
							level: skill.level - 1,
							isUnlocked: skill.level > 1,
					  }
					: skill
			);

			return {
				...prevData,
				skills: updatedSkills,
				availablePoints: prevData.availablePoints + skillToDowngrade.cost,
			};
		});
	}, []);

	return (
		<Container
			w='100%'
			h='100vh'
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '2rem',
			}}
		>
			<SkillTree data={skillTreeData} onSkillUpgrade={handleSkillUpgrade} onSkillDowngrade={handleSkillDowngrade} />
		</Container>
	);
};

export default App;
