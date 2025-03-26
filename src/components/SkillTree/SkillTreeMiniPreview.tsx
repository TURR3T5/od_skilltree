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
		const xValues = layoutedNodes.map((node) => node.position.x);
		const yValues = layoutedNodes.map((node) => node.position.y);
		const minX = Math.min(...xValues);
		const maxX = Math.max(...xValues);
		const minY = Math.min(...yValues);
		const maxY = Math.max(...yValues);
		const width = maxX - minX + 60;
		const height = maxY - minY + 60;
		const scaleX = 180 / width;
		const scaleY = 60 / height;
		const scale = Math.min(scaleX, scaleY);

		const scaledNodes = layoutedNodes.map((node) => {
			const skill = skillTree.skills.find((s) => s.id === node.id);
			return {
				id: node.id,
				x: 10 + (node.position.x - minX) * scale,
				y: 10 + (node.position.y - minY) * scale,
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
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							background: nodeColor,
							boxShadow: node.isUnlocked ? `0 0 8px ${nodeColor}` : 'none',
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

					const x1 = sourceNode.x + 5;
					const y1 = sourceNode.y + 5;
					const x2 = targetNode.x + 5;
					const y2 = targetNode.y + 5;

					let edgeColor;
					if (sourceNode.isMaxed) {
						edgeColor = theme.colors.green[6];
					} else if (sourceNode.isUnlocked) {
						edgeColor = theme.colors.blue[6];
					} else {
						edgeColor = theme.colors.gray[7];
					}

					return <line key={`${edge.source}-${edge.target}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={edgeColor} strokeWidth={1.5} strokeOpacity={sourceNode.isUnlocked ? 0.8 : 0.4} />;
				})}
			</svg>
		</Box>
	);
};
