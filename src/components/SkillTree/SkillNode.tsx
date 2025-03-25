import React from 'react';
import { Box, Tooltip, Text, useMantineTheme } from '@mantine/core';
import { NodeProps, Node } from '@xyflow/react';
import { Skill } from '../../types/SkillTypes';

// Extend the Node interface to include our custom data
export interface SkillNode extends Node {
	type: 'skillNode';
	id: string;
	position: { x: number; y: number };
	data: {
		skill: Skill;
		onUpgrade: () => void;
		onDowngrade?: () => void;
		isUpgradeable: boolean;
	};
}

export const SkillNode: React.FC<NodeProps<SkillNode>> = ({ data }) => {
	const theme = useMantineTheme();
	const { skill, onUpgrade, onDowngrade, isUpgradeable } = data;
	const SkillIcon = skill.icon;

	const getNodeBackground = () => {
		if (skill.isUnlocked) {
			return skill.level === skill.maxLevel ? theme.colors.green[7] : theme.colors.blue[7];
		}
		return theme.colors.dark[5];
	};

	return (
		<Tooltip
			label={
				<Box>
					<Text fw={700}>{skill.name}</Text>
					<Text size='sm'>{skill.description}</Text>
					<Text size='xs'>
						Level: {skill.level}/{skill.maxLevel}
					</Text>
				</Box>
			}
			multiline
			w={220}
			position='top'
		>
			<Box
				style={{
					position: 'relative',
					width: 100,
					height: 100,
					transform: 'rotate(45deg)',
					background: getNodeBackground(),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: theme.radius.sm,
					cursor: isUpgradeable ? 'pointer' : 'not-allowed',
					opacity: isUpgradeable ? 1 : 0.5,
					transition: 'all 0.3s ease',
					':hover': {
						transform: isUpgradeable ? 'rotate(45deg) scale(1.1)' : 'rotate(45deg)',
					},
				}}
				onClick={isUpgradeable ? onUpgrade : undefined}
			>
				{/* Rotated back to normal */}
				<Box
					style={{
						transform: 'rotate(-45deg)',
						color: 'white',
					}}
				>
					<SkillIcon size={32} />
					<Text ta='center' size='xs' mt={4}>
						{skill.level}/{skill.maxLevel}
					</Text>
				</Box>
			</Box>
		</Tooltip>
	);
};
