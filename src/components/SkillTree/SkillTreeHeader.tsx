import React from 'react';
import { Text, Group, Container, useMantineTheme } from '@mantine/core';
import { Medal, CurrencyCircleDollar } from '@phosphor-icons/react';

interface SkillTreeHeaderProps {
	name: string;
	playerLevel: number;
	availablePoints: number;
}

export const SkillTreeHeader: React.FC<SkillTreeHeaderProps> = ({ name, playerLevel, availablePoints }) => {
	const theme = useMantineTheme();

	return (
		<Container
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
						<Medal size={24} color={theme.colors.yellow[5]} />
						<Text c='white' fw={600}>
							Level {playerLevel}
						</Text>
					</Group>

					<Group gap='xs'>
						<CurrencyCircleDollar size={24} color={theme.colors.green[5]} />
						<Text c='white' fw={600}>
							{availablePoints} Points
						</Text>
					</Group>
				</Group>
			</Group>
		</Container>
	);
};
