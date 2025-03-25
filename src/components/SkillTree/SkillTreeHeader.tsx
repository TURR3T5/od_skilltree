import React from 'react';
import { Text, Group, Box, useMantineTheme } from '@mantine/core';
import { Trophy, Star } from '@phosphor-icons/react';

interface SkillTreeHeaderProps {
	name: string;
	playerLevel: number;
	availablePoints: number;
}

export const SkillTreeHeader: React.FC<SkillTreeHeaderProps> = ({ name, playerLevel, availablePoints }) => {
	const theme = useMantineTheme();

	return (
		<Box
			p='md'
			w='100%'
			style={{
				background: `linear-gradient(45deg, ${theme.colors.dark[7]}, ${theme.colors.dark[5]})`,
				borderTopLeftRadius: theme.radius.md,
				borderTopRightRadius: theme.radius.md,
			}}
		>
			<Group justify='space-between' align='center'>
				<Text size='xl' fw={700} c='white'>
					{name}
				</Text>

				<Group gap='lg'>
					<Group gap='xs'>
						<Trophy size={24} color={theme.colors.yellow[5]} />
						<Text c='white' fw={600}>
							Niveau {playerLevel}
						</Text>
					</Group>

					<Group gap='xs'>
						<Star size={24} color={theme.colors.green[5]} />
						<Text c='white' fw={600}>
							{availablePoints} Færdighhedspoint
						</Text>
					</Group>
				</Group>
			</Group>
		</Box>
	);
};
