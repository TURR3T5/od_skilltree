import React from 'react';
import { Card, Text, Group, Progress, Box, Badge, useMantineTheme, RingProgress } from '@mantine/core';
import { Trophy, Star } from '@phosphor-icons/react';
import { SkillTreeData } from '../../types/SkillTypes';
import { SkillTreeMiniPreview } from './SkillTreeMiniPreview';

interface SkillTreePreviewProps {
	skillTree: SkillTreeData;
	onSelect: (id: string) => void;
	isActive: boolean;
}

export const SkillTreePreview: React.FC<SkillTreePreviewProps> = ({ skillTree, onSelect, isActive }) => {
	const theme = useMantineTheme();

	const completedSkills = skillTree.skills.filter((skill) => skill.level === skill.maxLevel).length;
	const unlockedSkills = skillTree.skills.filter((skill) => skill.isUnlocked || skill.level > 0).length;
	const totalSkills = skillTree.skills.length;
	const completionPercentage = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;
	const progressPercentage = totalSkills > 0 ? (unlockedSkills / totalSkills) * 100 : 0;

	const handleClick = () => {
		onSelect(skillTree.id);
	};

	const hasUpgradeableSkills = skillTree.skills.some((skill) => {
		if (skill.level >= skill.maxLevel) return false;

		const levelRequirement = skill.level * 5;
		if (skillTree.playerLevel < levelRequirement) return false;

		if (skillTree.availablePoints < skill.cost) return false;

		if (!skill.isUnlocked && skill.requiredSkills) {
			const requiredSkillsUnlocked = skill.requiredSkills.every((reqId) => skillTree.skills.find((s) => s.id === reqId)?.isUnlocked);
			if (!requiredSkillsUnlocked) return false;
		}

		return true;
	});

	return (
		<Card
			p='lg'
			radius='md'
			withBorder
			onClick={handleClick}
			style={{
				cursor: 'pointer',
				borderColor: isActive ? theme.colors.blue[6] : undefined,
				transform: isActive ? 'scale(1.02)' : undefined,
				boxShadow: isActive ? `0 8px 16px rgba(0, 0, 0, 0.2)` : undefined,
				transition: 'all 0.3s ease',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				background: `linear-gradient(135deg, ${theme.colors.dark[8]}, ${theme.colors.dark[6]})`,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Header Section */}
			<Card.Section
				p='md'
				style={{
					background: `linear-gradient(45deg, ${theme.colors.dark[7]}, ${theme.colors.dark[5]})`,
					borderBottom: `1px solid ${theme.colors.dark[4]}`,
				}}
			>
				<Text fw={700} size='lg' c='white'>
					{skillTree.name}
				</Text>
			</Card.Section>

			<Badge
				color={hasUpgradeableSkills ? 'green' : 'red'}
				variant='filled'
				style={{
					position: 'absolute',
					top: 25,
					right: 15,
					zIndex: 10,
					animation: hasUpgradeableSkills ? 'pulse 2s infinite' : 'pulseRed 2s infinite',
				}}
			/>

			<Box p='xs' style={{ flex: 1 }}>
				<Text size='sm' c='gray.4' mb='md' lineClamp={2}>
					{skillTree.description}
				</Text>

				<SkillTreeMiniPreview skillTree={skillTree} />

				<Group align='center' mt='md' mb='md'>
					<RingProgress
						size={70}
						thickness={4}
						roundCaps
						sections={[{ value: completionPercentage, color: completedSkills === totalSkills ? 'green' : 'blue' }]}
						label={
							<Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
								<Text ta='center' fz='sm' fw={700}>
									{completedSkills}/{totalSkills}
								</Text>
							</Box>
						}
					/>

					<Box style={{ flex: 1 }}>
						<Group justify='space-between' mb='xs'>
							<Text size='sm' fw={500} c='gray.3'>
								Fremskridt
							</Text>
							<Text size='xs' c='gray.5'>
								{Math.round(progressPercentage)}%
							</Text>
						</Group>

						<Progress value={progressPercentage} size='md' radius='xl' color={unlockedSkills === totalSkills ? 'green' : 'blue'} />

						<Text size='xs' mt={4} c='gray.5'>
							{unlockedSkills} låst op
						</Text>
					</Box>
				</Group>

				<Group justify='space-between' mt='auto'>
					<Group gap='xs'>
						<Trophy size={22} color={theme.colors.yellow[5]} />
						<Text size='sm' c='gray.3'>
							Niveau {skillTree.playerLevel}
						</Text>
					</Group>

					<Group gap='xs'>
						<Star size={22} color={theme.colors.green[5]} />
						<Text size='sm' c='gray.3' fw={skillTree.availablePoints > 0 ? 600 : 400}>
							{skillTree.availablePoints} Points
						</Text>
					</Group>
				</Group>
			</Box>
		</Card>
	);
};
