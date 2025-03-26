import React from 'react';
import { SimpleGrid, Title, Container, Text, Box, useMantineTheme } from '@mantine/core';
import { SkillTreePreview } from './SkillTreePreview';
import { SkillTreeData } from '../../types/SkillTypes';

interface SkillTreesHomeProps {
	skillTrees: SkillTreeData[];
	onSelectSkillTree: (id: string) => void;
	activeSkillTreeId?: string;
}

export const SkillTreesHome: React.FC<SkillTreesHomeProps> = ({ skillTrees, onSelectSkillTree, activeSkillTreeId }) => {
	const theme = useMantineTheme();

	return (
		<Container size='xl' py='xl' px={0} style={{ maxWidth: '100%' }}>
			<Box
				mb='lg'
				p='md'
				style={{
					background: `linear-gradient(45deg, ${theme.colors.dark[7]}, ${theme.colors.dark[5]})`,
					borderRadius: theme.radius.md,
				}}
			>
				<Title order={2} c='white'>
					Færdighedstræer
				</Title>
				<Text c='gray.4' mt='xs'>
					Vælg et færdighedstræ for at se detaljer eller opgradere færdigheder
				</Text>
			</Box>

			<SimpleGrid cols={3} spacing='xl'>
				{skillTrees.map((skillTree) => (
					<SkillTreePreview key={skillTree.id} skillTree={skillTree} onSelect={onSelectSkillTree} isActive={activeSkillTreeId === skillTree.id} />
				))}
			</SimpleGrid>
		</Container>
	);
};
