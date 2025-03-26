import React from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { SkillTreeData } from '../../types/SkillTypes';

interface SkillTreeMiniPreviewProps {
	skillTree: SkillTreeData;
}

export const SkillTreeMiniPreview: React.FC<SkillTreeMiniPreviewProps> = ({ skillTree }) => {
	const theme = useMantineTheme();

	// Create a simplified representation of the skill tree
	// We'll draw small dots for each skill, with connecting lines based on connections
	return (
		<Box
			h={80}
			mt='md'
			mb='md'
			style={{
				position: 'relative',
				overflow: 'hidden',
				borderRadius: theme.radius.sm,
				background: `linear-gradient(135deg, ${theme.colors.dark[9]}, ${theme.colors.dark[7]})`,
			}}
		>
			{skillTree.skills.slice(0, 10).map((skill, index) => {
				// Calculate position based on index
				// This is a simplified layout - not the actual tree layout
				const row = Math.floor(index / 5);
				const col = index % 5;

				const x = 20 + col * 30;
				const y = 20 + row * 40;

				const isUnlocked = skill.isUnlocked || skill.level > 0;
				const isMaxed = skill.level === skill.maxLevel;

				const nodeColor = isMaxed ? theme.colors.green[6] : isUnlocked ? theme.colors.blue[6] : theme.colors.gray[7];

				return (
					<Box
						key={skill.id}
						style={{
							position: 'absolute',
							left: `${x}px`,
							top: `${y}px`,
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							background: nodeColor,
							boxShadow: isUnlocked ? `0 0 8px ${nodeColor}` : 'none',
						}}
					/>
				);
			})}

			{/* Draw simplified connections */}
			<svg width='100%' height='100%' style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
				{skillTree.connections.slice(0, 8).map((connection, index) => {
					// Find the indices of source and target skills
					const sourceIndex = skillTree.skills.findIndex((s) => s.id === connection.source);
					const targetIndex = skillTree.skills.findIndex((s) => s.id === connection.target);

					if (sourceIndex === -1 || targetIndex === -1 || sourceIndex >= 10 || targetIndex >= 10) return null;

					const sourceRow = Math.floor(sourceIndex / 5);
					const sourceCol = sourceIndex % 5;
					const targetRow = Math.floor(targetIndex / 5);
					const targetCol = targetIndex % 5;

					const x1 = 25 + sourceCol * 30;
					const y1 = 25 + sourceRow * 40;
					const x2 = 25 + targetCol * 30;
					const y2 = 25 + targetRow * 40;

					const sourceSkill = skillTree.skills.find((s) => s.id === connection.source);
					const isUnlocked = sourceSkill?.isUnlocked || (sourceSkill?.level ?? 0) > 0;

					return <line key={`${connection.source}-${connection.target}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isUnlocked ? theme.colors.blue[6] : theme.colors.gray[7]} strokeWidth={1.5} strokeOpacity={isUnlocked ? 0.8 : 0.4} />;
				})}
			</svg>
		</Box>
	);
};
