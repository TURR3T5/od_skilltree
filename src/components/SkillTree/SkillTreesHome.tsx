import React from 'react';
import { SimpleGrid, Title, Container, Text, Box, useMantineTheme, ScrollArea } from '@mantine/core';
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
		<Container size='xl' h='100%' py={0} px={0} style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
			<Box
				mb='lg'
				p='md'
				style={{
					background: `linear-gradient(45deg, ${theme.colors.dark[7]}, ${theme.colors.dark[5]})`,
					borderRadius: theme.radius.md,
					position: 'sticky',
					top: 0,
					zIndex: 5,
				}}
			>
				<Title order={2} c='white'>
					Færdighedstræer
				</Title>
				<Text c='gray.4' mt='xs'>
					Vælg et færdighedstræ for at se detaljer eller opgradere færdigheder
				</Text>
			</Box>

			<ScrollArea h='760px' scrollbarSize={0} type='auto'>
				<SimpleGrid cols={3} spacing='md' verticalSpacing='md'>
					{skillTrees.map((skillTree) => (
						<SkillTreePreview key={skillTree.id} skillTree={skillTree} onSelect={onSelectSkillTree} isActive={activeSkillTreeId === skillTree.id} />
					))}
				</SimpleGrid>
			</ScrollArea>
		</Container>
	);
};
