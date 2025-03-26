import React from 'react';
import { Card, Text, Group, Progress, Box, Badge, useMantineTheme } from '@mantine/core';
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
	const totalSkills = skillTree.skills.length;
	const completionPercentage = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

	const handleClick = () => {
		onSelect(skillTree.id);
	};

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
			}}
		>
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

			<Box p='xs' style={{ flex: 1 }}>
				<Text size='sm' c='gray.4' mb='md' lineClamp={2}>
					{skillTree.description}
				</Text>

				<SkillTreeMiniPreview skillTree={skillTree} />

				<Box mb='md'>
					<Group justify='space-between' mb='xs'>
						<Text size='sm' fw={500} c='gray.3'>
							Fremskridt
						</Text>
						<Badge color={completedSkills === totalSkills ? 'green' : 'blue'}>
							{completedSkills}/{totalSkills}
						</Badge>
					</Group>

					<Progress value={completionPercentage} size='md' radius='xl' color={completedSkills === totalSkills ? 'green' : 'blue'} />
				</Box>

				<Group justify='space-between' mt='auto'>
					<Group gap='xs'>
						<Trophy size={22} color={theme.colors.yellow[5]} />
						<Text size='sm' c='gray.3'>
							Niveau {skillTree.playerLevel}
						</Text>
					</Group>

					<Group gap='xs'>
						<Star size={22} color={theme.colors.green[5]} />
						<Text size='sm' c='gray.3'>
							{skillTree.availablePoints} Points
						</Text>
					</Group>
				</Group>
			</Box>
		</Card>
	);
};
