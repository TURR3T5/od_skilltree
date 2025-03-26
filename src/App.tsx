import React, { useState, useCallback } from 'react';
import { Container, Button, Group, Box, useMantineTheme } from '@mantine/core';
import { SkillTree } from './components';
import { SkillTreesHome } from './components/SkillTree/SkillTreesHome';
import { Fish, Boat, Waves, ArrowLeft, Tree, Campfire, Lightning, Leaf, MagnifyingGlass } from '@phosphor-icons/react';
import { SkillTreeData } from './types/SkillTypes';

const App: React.FC = () => {
	const theme = useMantineTheme();
	const [activeSkillTreeId, setActiveSkillTreeId] = useState<string | undefined>(undefined);

	const [skillTrees, setSkillTrees] = useState<SkillTreeData[]>([
		{
			id: 'fiskeri-faerdigheder',
			name: 'Fiskeri Færdigheder',
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
					requiredLevel: 0,
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
					requiredLevel: 0,
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
					requiredLevel: 0,
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
					requiredLevel: 5,
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
					requiredLevel: 5,
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
					requiredLevel: 15,
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
					requiredLevel: 10,
					requiredSkills: ['baad-navigation'],
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
					requiredLevel: 10,
					requiredSkills: ['baad-navigation'],
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
					requiredLevel: 20,
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
					requiredLevel: 15,
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
					requiredLevel: 25,
				},
			],
			connections: [
				{ source: 'stang-mesterskab', target: 'lokke-teknik' },
				{ source: 'lokke-teknik', target: 'avanceret-fangst' },
				{ source: 'lokke-teknik', target: 'ekstremt-fiskeri' },
				{ source: 'baad-navigation', target: 'dybt-vand-fiskeri' },
				{ source: 'baad-navigation', target: 'kyst-fiskeri' },
				{ source: 'dybt-vand-fiskeri', target: 'marine-okologi' },
				{ source: 'kyst-fiskeri', target: 'marine-okologi' },
				{ source: 'fysisk-udholdenhed', target: 'lokke-teknik' },
				{ source: 'fysisk-udholdenhed', target: 'udholdenhed-fiskeri' },
				{ source: 'lokke-teknik', target: 'professionel-fisker' },
			],
		},
		{
			id: 'jaeger-faerdigheder',
			name: 'Jæger Færdigheder',
			description: 'Bliv bedre til at jage og spore dyr i vildmarken',
			playerLevel: 25,
			availablePoints: 40,
			skills: [
				{
					id: 'sporing',
					name: 'Sporing',
					description: 'Forbedrer evnen til at spore dyr. Øger chancen for at finde sjældne dyr med 10% pr. niveau.',
					icon: MagnifyingGlass,
					level: 1,
					maxLevel: 5,
					cost: 3,
					isUnlocked: true,
					requiredLevel: 0,
				},
				{
					id: 'snigende-bevægelse',
					name: 'Snigende Bevægelse',
					description: 'Forbedrer evnen til at bevæge sig lydløst. Reducerer chancen for at skræmme dyr med 15% pr. niveau.',
					icon: Leaf,
					level: 2,
					maxLevel: 4,
					cost: 4,
					isUnlocked: true,
					requiredLevel: 5,
				},
				{
					id: 'jagt-instinkt',
					name: 'Jagt Instinkt',
					description: 'Øger din intuition under jagt. +10% chance for kritiske skud pr. niveau.',
					icon: Lightning,
					level: 0,
					maxLevel: 3,
					cost: 5,
					isUnlocked: false,
					requiredSkills: ['sporing'],
					requiredLevel: 10,
				},
				{
					id: 'skovens-camouflage',
					name: 'Skovens Camouflage',
					description: 'Forbedrer din kamuflage i skovområder. -20% chance for at blive opdaget pr. niveau.',
					icon: Tree,
					level: 0,
					maxLevel: 3,
					cost: 4,
					isUnlocked: false,
					requiredSkills: ['snigende-bevægelse'],
					requiredLevel: 15,
				},
				{
					id: 'vildmarkens-overlevelse',
					name: 'Vildmarkens Overlevelse',
					description: 'Forbedrer evnen til at overleve i vildmarken. +15 udholdenhed og +10 hunger/tørst modstand pr. niveau.',
					icon: Campfire,
					level: 0,
					maxLevel: 4,
					cost: 3,
					isUnlocked: false,
					requiredLevel: 10,
				},
			],
			connections: [
				{ source: 'sporing', target: 'jagt-instinkt' },
				{ source: 'snigende-bevægelse', target: 'skovens-camouflage' },
				{ source: 'jagt-instinkt', target: 'vildmarkens-overlevelse' },
				{ source: 'skovens-camouflage', target: 'vildmarkens-overlevelse' },
			],
		},
		{
			id: 'overlevelse-faerdigheder',
			name: 'Overlevelse Færdigheder',
			description: 'Lær at overleve under barske forhold i naturen',
			playerLevel: 18,
			availablePoints: 30,
			skills: [
				{
					id: 'bål-bygning',
					name: 'Bål Bygning',
					description: 'Forbedrer evnen til at bygge og vedligeholde bål. +15% varme pr. niveau.',
					icon: Campfire,
					level: 3,
					maxLevel: 5,
					cost: 2,
					isUnlocked: true,
					requiredLevel: 0,
				},
				{
					id: 'foraging',
					name: 'Foraging',
					description: 'Forbedrer evnen til at finde spiselige planter. +20% chance for at finde sjældne ingredienser pr. niveau.',
					icon: Leaf,
					level: 2,
					maxLevel: 4,
					cost: 3,
					isUnlocked: true,
					requiredLevel: 5,
				},
				{
					id: 'madlavning',
					name: 'Madlavning i Vildmarken',
					description: 'Forbedrer evnen til at tilberede mad i naturen. +25% næring fra mad pr. niveau.',
					icon: Campfire,
					level: 1,
					maxLevel: 3,
					cost: 4,
					isUnlocked: true,
					requiredSkills: ['bål-bygning'],
					requiredLevel: 10,
				},
				{
					id: 'vandkilder',
					name: 'Finde Vandkilder',
					description: 'Forbedrer evnen til at finde og rense vand. +30% chance for at finde vand og +15% vandkvalitet pr. niveau.',
					icon: Waves,
					level: 0,
					maxLevel: 3,
					cost: 3,
					isUnlocked: false,
					requiredLevel: 12,
				},
				{
					id: 'vejrforudsigelse',
					name: 'Vejrforudsigelse',
					description: 'Forbedrer evnen til at forudsige vejrændringer. +20% advarselsvarighed pr. niveau.',
					icon: Lightning,
					level: 0,
					maxLevel: 2,
					cost: 5,
					isUnlocked: false,
					requiredLevel: 15,
				},
			],
			connections: [
				{ source: 'bål-bygning', target: 'madlavning' },
				{ source: 'foraging', target: 'madlavning' },
				{ source: 'madlavning', target: 'vejrforudsigelse' },
				{ source: 'vandkilder', target: 'vejrforudsigelse' },
			],
		},
	]);

	const handleSelectSkillTree = useCallback((id: string) => {
		setActiveSkillTreeId(id);
	}, []);

	const handleBackToHome = useCallback(() => {
		setActiveSkillTreeId(undefined);
	}, []);

	const handleSkillUpgrade = useCallback(
		(skillId: string) => {
			setSkillTrees((prevSkillTrees) => {
				return prevSkillTrees.map((tree) => {
					if (tree.id !== activeSkillTreeId) return tree;

					const skillToUpgrade = tree.skills.find((s) => s.id === skillId);
					if (!skillToUpgrade || skillToUpgrade.level >= skillToUpgrade.maxLevel) {
						return tree;
					}

					const newAvailablePoints = tree.availablePoints - skillToUpgrade.cost;
					const updatedSkills = tree.skills.map((skill) =>
						skill.id === skillId
							? {
									...skill,
									level: skill.level + 1,
									isUnlocked: true,
							  }
							: skill
					);

					return {
						...tree,
						skills: updatedSkills,
						availablePoints: newAvailablePoints,
					};
				});
			});
		},
		[activeSkillTreeId]
	);

	const handleSkillDowngrade = useCallback(
		(skillId: string) => {
			setSkillTrees((prevSkillTrees) => {
				return prevSkillTrees.map((tree) => {
					if (tree.id !== activeSkillTreeId) return tree;

					const skillToDowngrade = tree.skills.find((s) => s.id === skillId);
					if (!skillToDowngrade || skillToDowngrade.level <= 0) {
						return tree;
					}

					const dependentSkills = tree.skills.filter((s) => s.requiredSkills?.includes(skillId) && s.isUnlocked && s.level > 0);

					if (dependentSkills.length > 0 && skillToDowngrade.level <= 1) {
						return tree;
					}

					const updatedSkills = tree.skills.map((skill) =>
						skill.id === skillId
							? {
									...skill,
									level: skill.level - 1,
									isUnlocked: skill.level > 1,
							  }
							: skill
					);

					return {
						...tree,
						skills: updatedSkills,
						availablePoints: tree.availablePoints + skillToDowngrade.cost,
					};
				});
			});
		},
		[activeSkillTreeId]
	);

	const activeSkillTree = skillTrees.find((tree) => tree.id === activeSkillTreeId);

	return (
		<Container w='100%' h='100vh' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Container
				w='100%'
				h='80vh'
				p='lg'
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'stretch',
					justifyContent: 'center',
					background: theme.colors.dark[9],
					borderRadius: theme.radius.lg,
				}}
			>
				{activeSkillTree ? (
					<>
						<Group mb='lg'>
							<Button leftSection={<ArrowLeft size={18} />} variant='subtle' onClick={handleBackToHome} color='gray'>
								Tilbage til Oversigt
							</Button>
						</Group>
						<Box style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<SkillTree data={activeSkillTree} onSkillUpgrade={handleSkillUpgrade} onSkillDowngrade={handleSkillDowngrade} />
						</Box>
					</>
				) : (
					<SkillTreesHome skillTrees={skillTrees} onSelectSkillTree={handleSelectSkillTree} activeSkillTreeId={activeSkillTreeId} />
				)}
			</Container>
		</Container>
	);
};

export default App;
