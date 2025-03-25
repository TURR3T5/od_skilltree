import React, { useState } from 'react';
import { SkillTree } from './components';
import { Shield, Crosshair, Fire, Lightning, Waves, Target, Barbell, Flask, Brain, FlagBanner, Sword } from '@phosphor-icons/react';
import { SkillTreeData } from './types/SkillTypes';
import { Container } from '@mantine/core';

const App: React.FC = () => {
	const [skillTreeData, setSkillTreeData] = useState<SkillTreeData>({
		id: 'combat-skills',
		name: 'Combat Mastery',
		description: 'Unlock and improve your combat abilities',
		playerLevel: 10,
		availablePoints: 25,
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
				id: 'fire-magic',
				name: 'Fire Magic',
				description: 'Harness the power of fire',
				icon: Fire,
				level: 0,
				maxLevel: 5,
				cost: 5,
				isUnlocked: false,
			},
			{
				id: 'physical-conditioning',
				name: 'Physical Conditioning',
				description: 'Improve physical attributes',
				icon: Barbell,
				level: 0,
				maxLevel: 5,
				cost: 2,
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
				requiredSkills: ['sword-mastery'],
				isUnlocked: false,
			},
			{
				id: 'lightning-bolt',
				name: 'Lightning Bolt',
				description: 'Call down lightning on your enemies',
				icon: Lightning,
				level: 0,
				maxLevel: 3,
				cost: 4,
				requiredSkills: ['fire-magic'],
				isUnlocked: false,
			},
			{
				id: 'water-magic',
				name: 'Water Magic',
				description: 'Control the flow of water',
				icon: Waves,
				level: 0,
				maxLevel: 5,
				cost: 5,
				requiredSkills: ['fire-magic'],
				isUnlocked: false,
			},
			{
				id: 'tactical-awareness',
				name: 'Tactical Awareness',
				description: 'Improve battlefield awareness',
				icon: Brain,
				level: 0,
				maxLevel: 3,
				cost: 4,
				requiredSkills: ['physical-conditioning'],
				isUnlocked: false,
			},
			{
				id: 'dual-wielding',
				name: 'Dual Wielding',
				description: 'Master fighting with two weapons',
				icon: Sword,
				level: 0,
				maxLevel: 5,
				cost: 5,
				requiredSkills: ['sword-mastery', 'physical-conditioning'],
				isUnlocked: false,
			},
			{
				id: 'elemental-mastery',
				name: 'Elemental Mastery',
				description: 'Master all elements to enhance your magic',
				icon: Flask,
				level: 0,
				maxLevel: 5,
				cost: 6,
				requiredSkills: ['fire-magic', 'water-magic'],
				isUnlocked: false,
			},
			{
				id: 'master-archer',
				name: 'Master Archer',
				description: 'Become one with the bow',
				icon: Target,
				level: 0,
				maxLevel: 5,
				cost: 4,
				requiredSkills: ['precision-strike'],
				isUnlocked: false,
			},
			{
				id: 'leadership',
				name: 'Leadership',
				description: 'Inspire allies to fight harder',
				icon: FlagBanner,
				level: 0,
				maxLevel: 4,
				cost: 3,
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

	const handleSkillUpgrade = (skillId: string) => {
		setSkillTreeData((prevData) => {
			const updatedSkills = prevData.skills.map((skill) => {
				if (skill.id === skillId) {
					const newLevel = skill.level + 1;

					return {
						...skill,
						level: newLevel,
						isUnlocked: true,
					};
				}
				return skill;
			});

			return {
				...prevData,
				skills: updatedSkills,
				availablePoints: prevData.availablePoints - prevData.skills.find((s) => s.id === skillId)!.cost,
			};
		});
	};

	const handleSkillDowngrade = (skillId: string) => {
		setSkillTreeData((prevData) => {
			const skillToDowngrade = prevData.skills.find((s) => s.id === skillId);

			if (!skillToDowngrade || skillToDowngrade.level <= 0) {
				return prevData;
			}

			const dependentSkills = prevData.skills.filter((s) => s.requiredSkills?.includes(skillId) && s.isUnlocked);

			if (dependentSkills.length > 0 && skillToDowngrade.level <= 1) {
				return prevData;
			}

			const updatedSkills = prevData.skills.map((skill) => {
				if (skill.id === skillId) {
					const newLevel = skill.level - 1;
					return {
						...skill,
						level: newLevel,
						isUnlocked: newLevel > 0,
					};
				}
				return skill;
			});

			return {
				...prevData,
				skills: updatedSkills,
				availablePoints: prevData.availablePoints + skillToDowngrade.cost,
			};
		});
	};

	return (
		<Container w={1100} h='100vh' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<SkillTree data={skillTreeData} onSkillUpgrade={handleSkillUpgrade} onSkillDowngrade={handleSkillDowngrade} />
		</Container>
	);
};

export default App;
