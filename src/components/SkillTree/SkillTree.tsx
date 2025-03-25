import React, { useCallback } from 'react';
import { Box, Container, useMantineTheme } from '@mantine/core';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Controls, Background, MiniMap, NodeTypes, EdgeTypes, Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SkillTreeHeader } from './SkillTreeHeader';
import { SkillNode } from './SkillNode';
import { SkillTreeProps, SkillTreeData } from '../../types/SkillTypes';
import { calculateSkillTreeLayout, isSkillUnlockable } from '../../utils/skillTreeHelper';

export const SkillTree: React.FC<SkillTreeProps> = ({ data, onSkillUpgrade, onSkillDowngrade }) => {
	const theme = useMantineTheme();

	// Prepare initial nodes
	const initialNodes = React.useMemo(() => {
		const layout = calculateSkillTreeLayout(data.skills);

		return data.skills.map((skill, index) => ({
			id: skill.id,
			type: 'skillNode',
			position: layout[index],
			data: {
				skill,
				onUpgrade: () => {
					// Implement upgrade logic
					onSkillUpgrade(skill.id);
				},
				onDowngrade: onSkillDowngrade ? () => onSkillDowngrade(skill.id) : undefined,
				isUpgradeable: isSkillUnlockable(skill, data.skills, data.playerLevel, data.availablePoints),
			} as SkillNode['data'],
		}));
	}, [data.skills, data.playerLevel, data.availablePoints, onSkillUpgrade, onSkillDowngrade]);

	// Prepare initial edges
	const initialEdges = React.useMemo(
		() =>
			data.connections.map((connection) => ({
				id: `${connection.source}-${connection.target}`,
				source: connection.source,
				target: connection.target,
				type: 'smoothstep',
				style: {
					stroke: theme.colors.gray[6],
					strokeWidth: 2,
				},
			})),
		[data.connections]
	);

	// Node and edge state management
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	// Connection handler with explicit typing
	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((eds) => addEdge(connection, eds));
		},
		[setEdges]
	);

	// Custom node types
	const nodeTypes: NodeTypes = {
		skillNode: SkillNode,
	};

	return (
		<Container>
			<SkillTreeHeader name={data.name} playerLevel={data.playerLevel} availablePoints={data.availablePoints} />

			<Box
				style={{
					height: '70vh',
					background: theme.colors.dark[8],
					borderRadius: theme.radius.md,
				}}
			>
				<ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView attributionPosition='bottom-right'>
					<Background color={theme.colors.dark[7]} gap={12} size={1} />
					<Controls position='bottom-right' />
					<MiniMap nodeColor={theme.colors.blue[7]} position='bottom-left' />
				</ReactFlow>
			</Box>
		</Container>
	);
};
