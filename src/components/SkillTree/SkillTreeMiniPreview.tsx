import React, { useEffect, useState } from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { SkillTreeData } from '../../types/SkillTypes';
import { layoutSkillTree } from '../../utils/skillTreeHelper';
import { Edge } from '@xyflow/react';

interface SkillTreeMiniPreviewProps {
	skillTree: SkillTreeData;
}

interface MiniNodePosition {
	id: string;
	x: number;
	y: number;
	isUnlocked: boolean;
	isMaxed: boolean;
}

export const SkillTreeMiniPreview: React.FC<SkillTreeMiniPreviewProps> = ({ skillTree }) => {
	const theme = useMantineTheme();
	const [nodePositions, setNodePositions] = useState<MiniNodePosition[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	useEffect(() => {
		const initialNodes = skillTree.skills.map((skill) => ({
			id: skill.id,
			type: 'skillNode',
			position: { x: 0, y: 0 },
			data: {
				skill,
				skills: skillTree.skills,
				onUpgrade: () => {},
				isUpgradeable: false,
				playerLevel: skillTree.playerLevel,
				availablePoints: skillTree.availablePoints,
				hasIncomingConnections: false,
			},
		}));

		const initialEdges = skillTree.connections.map((connection) => ({
			id: `${connection.source}-${connection.target}`,
			source: connection.source,
			target: connection.target,
			type: 'smoothstep',
		}));

		const { nodes: layoutedNodes } = layoutSkillTree(initialNodes, initialEdges);

		// Calculate bounds with padding
		const xValues = layoutedNodes.map((node) => node.position.x);
		const yValues = layoutedNodes.map((node) => node.position.y);
		const minX = Math.min(...xValues);
		const maxX = Math.max(...xValues);
		const minY = Math.min(...yValues);
		const maxY = Math.max(...yValues);

		// Increased padding to prevent nodes from being too close to the edge
		const padding = 30;
		const width = maxX - minX + 120 + padding * 2;
		const height = maxY - minY + 120 + padding * 2;

		// Use more conservative scaling to maintain proportions
		const containerWidth = 180;
		const containerHeight = 80;
		const scaleX = containerWidth / width;
		const scaleY = containerHeight / height;
		const scale = Math.min(scaleX, scaleY) * 0.85; // Add a bit more space with 0.85 factor

		// Center the layout in the container
		const offsetX = (containerWidth - width * scale) / 2 + padding * scale;
		const offsetY = (containerHeight - height * scale) / 2 + padding * scale;

		const scaledNodes = layoutedNodes.map((node) => {
			const skill = skillTree.skills.find((s) => s.id === node.id);
			return {
				id: node.id,
				x: offsetX + (node.position.x - minX) * scale,
				y: offsetY + (node.position.y - minY) * scale,
				isUnlocked: skill?.isUnlocked || (skill?.level ?? 0) > 0,
				isMaxed: skill?.level === skill?.maxLevel,
			};
		});

		setNodePositions(scaledNodes);
		setEdges(initialEdges);
	}, [skillTree]);

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
			{nodePositions.map((node) => {
				const nodeColor = node.isMaxed ? theme.colors.green[6] : node.isUnlocked ? theme.colors.blue[6] : theme.colors.gray[7];

				return (
					<Box
						key={node.id}
						style={{
							position: 'absolute',
							left: `${node.x}px`,
							top: `${node.y}px`,
							width: '8px',
							height: '8px',
							transform: 'rotate(45deg)',
							background: nodeColor,
							boxShadow: node.isUnlocked ? `0 0 6px ${nodeColor}` : 'none',
							zIndex: 2,
						}}
					/>
				);
			})}

			<svg width='100%' height='100%' style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
				{edges.map((edge) => {
					const sourceNode = nodePositions.find((n) => n.id === edge.source);
					const targetNode = nodePositions.find((n) => n.id === edge.target);

					if (!sourceNode || !targetNode) return null;

					const x1 = sourceNode.x + 4;
					const y1 = sourceNode.y + 4;
					const x2 = targetNode.x + 4;
					const y2 = targetNode.y + 4;

					let edgeColor;
					if (sourceNode.isMaxed) {
						edgeColor = theme.colors.green[6];
					} else if (sourceNode.isUnlocked) {
						edgeColor = theme.colors.blue[6];
					} else {
						edgeColor = theme.colors.gray[7];
					}

					// Calculate orthogonal path with rounded corners
					const cornerRadius = 3; // Radius for the rounded corners
					const midY = (y1 + y2) / 2;
					const midX = (x1 + x2) / 2;

					let pathData;

					// Create orthogonal path with rounded corners
					if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
						// Path is more horizontal than vertical - go horizontal first
						pathData = `
							M ${x1} ${y1}
							L ${midX - cornerRadius} ${y1}
							Q ${midX} ${y1} ${midX} ${y1 + cornerRadius}
							L ${midX} ${y2 - cornerRadius}
							Q ${midX} ${y2} ${midX + cornerRadius} ${y2}
							L ${x2} ${y2}
						`;
					} else {
						pathData = `
							M ${x1} ${y1}
							L ${x1} ${midY - cornerRadius}
							Q ${x1} ${midY} ${x1 + cornerRadius} ${midY}
							L ${x2 - cornerRadius} ${midY}
							Q ${x2} ${midY} ${x2} ${midY + cornerRadius}
							L ${x2} ${y2}
						`;
					}

					return <path key={`${edge.source}-${edge.target}`} d={pathData} stroke={edgeColor} strokeWidth={1.5} strokeDasharray='3 3' strokeOpacity={sourceNode.isUnlocked ? 0.8 : 0.4} fill='none' />;
				})}
			</svg>
		</Box>
	);
};
