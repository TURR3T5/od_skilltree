import { Box, Container, useMantineTheme, Stack } from '@mantine/core';
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, ReactFlowProvider, ConnectionLineType, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './skillTree.css';
import React, { useCallback, useMemo, useRef } from 'react';
import { SkillTreeHeader } from './SkillTreeHeader';
import { SkillNode } from './SkillNode';
import { SkillTreeProps } from '../../types/SkillTypes';
import { SkillNodeData } from '../../types/SkillNodeData';
import { isSkillUnlockable, layoutSkillTree, createSkillTreeEdges } from '../../utils/skillTreeHelper';

const SkillTreeInner: React.FC<SkillTreeProps> = ({ data, onSkillUpgrade, onSkillDowngrade }) => {
	const theme = useMantineTheme();
	const reactFlowRef = useRef<any>(null);
	const containerWidth = 1100;

	const nodeTypes = useMemo(() => ({ skillNode: SkillNode }), []);

	const initialNodes: SkillNodeData[] = useMemo(() => {
		// First create nodes without the hasIncomingConnections property
		const basicNodes = data.skills.map((skill) => ({
			id: skill.id,
			type: 'skillNode',
			position: { x: 0, y: 0 }, // Will be positioned by dagre
			draggable: false,
			width: 120,
			height: 120,
			data: {
				skill,
				onUpgrade: () => onSkillUpgrade(skill.id),
				onDowngrade: onSkillDowngrade ? () => onSkillDowngrade(skill.id) : undefined,
				isUpgradeable: isSkillUnlockable(skill, data.skills, data.playerLevel, data.availablePoints),
				playerLevel: data.playerLevel,
				availablePoints: data.availablePoints,
				hasIncomingConnections: false, // Default value, will be updated
			},
		}));

		// Now determine which nodes have incoming connections
		return basicNodes.map((node) => {
			// Check if this node is a target in any connection
			const hasIncoming = data.connections.some((conn) => conn.target === node.id);

			return {
				...node,
				data: {
					...node.data,
					hasIncomingConnections: hasIncoming,
				},
			};
		});
	}, [data.skills, data.connections, data.playerLevel, data.availablePoints, onSkillUpgrade, onSkillDowngrade]);

	const initialEdges: Edge[] = useMemo(() => createSkillTreeEdges(data.connections, data.skills, theme), [data.connections, data.skills, theme]);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	React.useEffect(() => {
		// Apply layout to nodes and edges when data changes
		const { nodes: layoutedNodes, edges: layoutedEdges } = layoutSkillTree(initialNodes, initialEdges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [data, initialNodes, initialEdges, setNodes, setEdges]);

	React.useEffect(() => {
		// Update edges when a skill gets unlocked
		const updatedEdges = createSkillTreeEdges(data.connections, data.skills, theme);
		setEdges(updatedEdges);
	}, [data.skills, data.connections, theme, setEdges]);

	const onInit = useCallback((instance: any) => {
		setTimeout(() => {
			instance.fitView({ padding: 0.2 });
		}, 200);
	}, []);

	return (
		<Container w={containerWidth} p={0}>
			<Stack gap={0} w={containerWidth}>
				<SkillTreeHeader name={data.name} playerLevel={data.playerLevel} availablePoints={data.availablePoints} />

				<Box
					style={{
						borderBottomLeftRadius: theme.radius.md,
						borderBottomRightRadius: theme.radius.md,
					}}
					h='60vh'
					bg='dark.8'
				>
					<ReactFlow
						ref={reactFlowRef}
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						nodeTypes={nodeTypes}
						connectionLineType={ConnectionLineType.SmoothStep}
						fitView
						proOptions={{ hideAttribution: true }}
						minZoom={0.5}
						maxZoom={1.5}
						defaultEdgeOptions={{
							type: 'smoothstep',
							animated: true,
						}}
						onInit={onInit}
					>
						<Background color={theme.colors.dark[7]} gap={12} size={1} />
						<Controls position='bottom-right' />
					</ReactFlow>
				</Box>
			</Stack>
		</Container>
	);
};

export const SkillTree: React.FC<SkillTreeProps> = (props) => {
	return (
		<ReactFlowProvider>
			<SkillTreeInner {...props} />
		</ReactFlowProvider>
	);
};
