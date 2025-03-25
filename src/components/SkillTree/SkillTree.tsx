import React, { useCallback, useRef, useMemo } from 'react';
import { Box, Container, useMantineTheme, Stack } from '@mantine/core';
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, NodeTypes, MarkerType, ReactFlowProvider, ConnectionLineType, Node, Edge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';

import { SkillTreeHeader } from './SkillTreeHeader';
import { SkillNode } from './SkillNode';
import { SkillTreeProps } from '../../types/SkillTypes';
import { SkillNodeData } from '../../types/SkillNodeData';
import { calculateSkillTreeLayout, isSkillUnlockable } from '../../utils/skillTreeHelper';

// Type-safe layout function
const getLayoutedElements = (nodes: Node<SkillNodeData>[], edges: Edge[], direction: 'TB' | 'LR' = 'TB'): { nodes: Node<SkillNodeData>[]; edges: Edge[] } => {
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));
	const isHorizontal = direction === 'LR';
	dagreGraph.setGraph({ rankdir: direction });

	const nodeWidth = 120;
	const nodeHeight = 120;

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	const newNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		return {
			...node,
			targetPosition: isHorizontal ? Position.Left : Position.Top,
			sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
			width: nodeWidth,
			height: nodeHeight,
		};
	});

	return { nodes: newNodes, edges };
};

const SkillTreeInner: React.FC<SkillTreeProps> = ({ data, onSkillUpgrade, onSkillDowngrade }) => {
	const theme = useMantineTheme();
	const reactFlowRef = useRef<any>(null);

	// Memoized initial nodes with type-safe data
	const initialNodes: Node<SkillNodeData>[] = useMemo(() => {
		const layout = calculateSkillTreeLayout(data.skills, data.connections);

		return data.skills.map((skill, index) => ({
			id: skill.id,
			type: 'skillNode',
			position: layout[index],
			draggable: false,
			width: 120,
			height: 120,
			data: {
				skill,
				onUpgrade: () => {
					onSkillUpgrade(skill.id);
				},
				onDowngrade: onSkillDowngrade ? () => onSkillDowngrade(skill.id) : undefined,
				isUpgradeable: isSkillUnlockable(skill, data.skills, data.playerLevel, data.availablePoints),
				playerLevel: data.playerLevel,
				availablePoints: data.availablePoints,
			},
		}));
	}, [data.skills, data.connections, data.playerLevel, data.availablePoints, onSkillUpgrade, onSkillDowngrade]);

	// Memoized initial edges with proper typing
	const initialEdges: Edge[] = useMemo(
		() =>
			data.connections.map((connection) => {
				const sourceSkill = data.skills.find((s) => s.id === connection.source);
				const targetSkill = data.skills.find((s) => s.id === connection.target);
				const isPathUnlocked = sourceSkill?.isUnlocked || false;

				return {
					id: `${connection.source}-${connection.target}`,
					source: connection.source,
					target: connection.target,
					type: 'smoothstep',
					animated: true,
					style: {
						stroke: isPathUnlocked ? theme.colors.blue[6] : theme.colors.gray[7],
						strokeWidth: 3,
						opacity: isPathUnlocked ? 1 : 0.5,
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: isPathUnlocked ? theme.colors.blue[6] : theme.colors.gray[7],
						width: 20,
						height: 20,
					},
				};
			}),
		[data.connections, data.skills, theme.colors]
	);

	// Nodes and edges state with type inference
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	// Update layout when data changes
	React.useEffect(() => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [data, initialNodes, initialEdges, setNodes, setEdges]);

	// Node types with type safety
	const nodeTypes: NodeTypes = {
		skillNode: SkillNode,
	};

	// Initialize view
	const onInit = useCallback((instance: any) => {
		setTimeout(() => {
			instance.fitView({ padding: 0.2 });
		}, 200);
	}, []);

	// Layout recalculation
	const onLayout = useCallback(
		(direction: 'TB' | 'LR') => {
			const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

			setNodes([...layoutedNodes]);
			setEdges([...layoutedEdges]);
		},
		[nodes, edges, setNodes, setEdges]
	);

	return (
		<Container w={1100}>
			<Stack gap={0} w={1100}>
				<SkillTreeHeader name={data.name} playerLevel={data.playerLevel} availablePoints={data.availablePoints} />

				<Box
					style={{
						borderBottomLeftRadius: theme.radius.md,
						borderBottomRightRadius: theme.radius.md,
					}}
					h='60vh'
					bg='dark.8'
				>
					<ReactFlow ref={reactFlowRef} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} connectionLineType={ConnectionLineType.SmoothStep} fitView proOptions={{ hideAttribution: true }} colorMode='dark' maxZoom={1.2} minZoom={0.75} onInit={onInit}>
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
