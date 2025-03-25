import React, { useState, useCallback } from 'react';
import { Container } from '@mantine/core';
import { SkillTree } from './components';
import { Fish, Boat, Waves } from '@phosphor-icons/react';
import { SkillTreeData } from './types/SkillTypes';

const App: React.FC = () => {
	const [skillTreeData, setSkillTreeData] = useState<SkillTreeData>({
		id: 'fiskeri-faerdigheder',
		name: 'Fiskeri Mesterskab',
		description: 'Lås op og forbedrer dine fiskefærdigheder',
		playerLevel: 30,
		availablePoints: 55,
		skills: [
			{
				id: 'stang-mesterskab',
				name: 'Stang Mesterskab',
				description: 'Forbedrer håndtering af fiskestang og chancen for at fange store fisk. Øger fangstchancen med 10% pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 5,
				cost: 3,
				isUnlocked: false,
			},
			{
				id: 'baad-navigation',
				name: 'Båd Navigation',
				description: 'Forbedrer evnen til at navigere og manøvrere både. Øger bevægelseshastighed og stabilitet.',
				icon: Boat,
				level: 0,
				maxLevel: 5,
				cost: 5,
				isUnlocked: false,
			},
			{
				id: 'fysisk-udholdenhed',
				name: 'Fysisk Udholdenhed',
				description: 'Forbedrer fysisk styrke og udholdenhed. +5 styrke og +5 udholdenhed pr. niveau.',
				icon: Waves,
				level: 0,
				maxLevel: 5,
				cost: 2,
				isUnlocked: false,
			},
			{
				id: 'avanceret-fangst',
				name: 'Avanceret Fangst',
				description: 'Øg chancen for at fange sjældne og store fisk. +15% chance for specielle fangster pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 3,
				cost: 2,
				requiredSkills: ['lokke-teknik'],
				isUnlocked: false,
			},
			{
				id: 'lokke-teknik',
				name: 'Lokke Teknik',
				description: 'Forbedrer evnen til at lokke fisk til krogen. Øger fangstchancen med 5% pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 3,
				cost: 2,
				isUnlocked: false,
				requiredSkills: ['fysisk-udholdenhed'],
			},
			{
				id: 'ekstremt-fiskeri',
				name: 'Ekstremt Fiskeri',
				description: 'Forbedrer evnen til at fiske under ekstreme forhold. Øger fangstchancen med 20% pr. niveau.',
				icon: Waves,
				level: 0,
				maxLevel: 2,
				cost: 4,
				requiredSkills: ['lokke-teknik'],
				isUnlocked: false,
			},
			{
				id: 'dybt-vand-fiskeri',
				name: 'Dybt Vand Fiskeri',
				description: 'Forbedrer evnen til at fiske i dybt vand. Øger fangstchancen med 15% pr. niveau.',
				icon: Boat,
				level: 0,
				maxLevel: 3,
				cost: 3,
				isUnlocked: false,
			},
			{
				id: 'kyst-fiskeri',
				name: 'Kyst Fiskeri',
				description: 'Forbedrer evnen til at fiske ved kysten. Øger fangstchancen med 10% pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 3,
				cost: 2,
				isUnlocked: false,
			},
			{
				id: 'marine-okologi',
				name: 'Marine Økologi',
				description: 'Forståelse af marine økosystemer for bedre fiskeri. Øger fangstchancen med 5% pr. niveau.',
				icon: Waves,
				level: 0,
				maxLevel: 3,
				cost: 3,
				requiredSkills: ['dybt-vand-fiskeri', 'kyst-fiskeri'],
				isUnlocked: false,
			},
			{
				id: 'udholdenhed-fiskeri',
				name: 'Udholdenhed Fiskeri',
				description: 'Forbedrer evnen til at fiske i længere perioder. Øger udholdenhed med 10% pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 3,
				cost: 2,
				requiredSkills: ['fysisk-udholdenhed'],
				isUnlocked: false,
			},
			{
				id: 'professionel-fisker',
				name: 'Professionel Fisker',
				description: 'Bliv en professionel fisker med avancerede teknikker. Øger fangstchancen med 25% pr. niveau.',
				icon: Fish,
				level: 0,
				maxLevel: 1,
				cost: 5,
				requiredSkills: ['lokke-teknik'],
				isUnlocked: false,
			}
		],
		connections: [
			{ source: 'stang-mesterskab', target: 'avanceret-fangst' },
			{ source: 'stang-mesterskab', target: 'lokke-teknik' },
			{ source: 'lokke-teknik', target: 'ekstremt-fiskeri' },
			{ source: 'baad-navigation', target: 'dybt-vand-fiskeri' },
			{ source: 'baad-navigation', target: 'kyst-fiskeri' },
			{ source: 'kyst-fiskeri', target: 'marine-okologi' },
			{ source: 'dybt-vand-fiskeri', target: 'marine-okologi' },
			{ source: 'fysisk-udholdenhed', target: 'lokke-teknik' },
			{ source: 'fysisk-udholdenhed', target: 'udholdenhed-fiskeri' },
			{ source: 'stang-mesterskab', target: 'udholdenhed-fiskeri' },
			{ source: 'lokke-teknik', target: 'professionel-fisker' },
			{ source: 'ekstremt-fiskeri', target: 'professionel-fisker' },
			{ source: 'marine-okologi', target: 'professionel-fisker' },
			{ source: 'udholdenhed-fiskeri', target: 'professionel-fisker' }
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
