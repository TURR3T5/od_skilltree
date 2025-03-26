import { Box, Container, useMantineTheme, Stack, Text, rgba } from '@mantine/core';
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
	const containerWidth = '100%';

	const nodeTypes = useMemo(() => ({ skillNode: SkillNode }), []);

	const initialNodes: SkillNodeData[] = useMemo(() => {
		const basicNodes = data.skills.map((skill) => ({
			id: skill.id,
			type: 'skillNode',
			position: { x: 0, y: 0 },
			draggable: false,
			width: 120,
			height: 120,
			data: {
				skill,
				skills: data.skills,
				onUpgrade: () => onSkillUpgrade(skill.id),
				onDowngrade: onSkillDowngrade ? () => onSkillDowngrade(skill.id) : undefined,
				isUpgradeable: isSkillUnlockable(skill, data.skills, data.playerLevel, data.availablePoints),
				playerLevel: data.playerLevel,
				availablePoints: data.availablePoints,
				hasIncomingConnections: false,
			},
		}));

		return basicNodes.map((node) => {
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

	const initialEdges: Edge[] = useMemo(() => {
		const edges = createSkillTreeEdges(data.connections, data.skills, theme);

		return edges.map((edge) => {
			const sourceSkill = data.skills.find((s) => s.id === edge.source);
			const isMaxedOut = sourceSkill?.level === sourceSkill?.maxLevel;

			return {
				...edge,
				className: isMaxedOut ? 'maxed-edge' : undefined,
			};
		});
	}, [data.connections, data.skills, theme]);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	React.useEffect(() => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = layoutSkillTree(initialNodes, initialEdges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [data, initialNodes, initialEdges, setNodes, setEdges]);

	React.useEffect(() => {
		const edgesWithClasses = createSkillTreeEdges(data.connections, data.skills, theme).map((edge) => {
			const sourceSkill = data.skills.find((s) => s.id === edge.source);
			const isMaxedOut = sourceSkill?.level === sourceSkill?.maxLevel;

			return {
				...edge,
				className: isMaxedOut ? 'maxed-edge' : undefined,
			};
		});

		setEdges(edgesWithClasses);
	}, [data.skills, data.connections, theme, setEdges]);

	const onInit = useCallback((instance: any) => {
		setTimeout(() => {
			instance.fitView({ padding: 0.2 });
		}, 200);
	}, []);

	const totalSkills = data.skills.length;
	const completedSkills = data.skills.filter((skill) => skill.level === skill.maxLevel).length;
	const completionPercentage = Math.round((completedSkills / totalSkills) * 100);

	return (
		<Container w={containerWidth} p={0}>
			<Stack gap={0} w={containerWidth}>
				<SkillTreeHeader name={data.name} playerLevel={data.playerLevel} availablePoints={data.availablePoints} />

				<Box
					style={{
						borderBottomLeftRadius: theme.radius.md,
						borderBottomRightRadius: theme.radius.md,
						position: 'relative',
					}}
					h='750px'
					bg='dark.8'
				>
					{/* Completion status overlay */}
					<Box
						style={{
							position: 'absolute',
							top: 10,
							right: 10,
							zIndex: 10,
							background: rgba(theme.colors.dark[9], 0.7),
							padding: '5px 10px',
							borderRadius: theme.radius.sm,
							backdropFilter: 'blur(5px)',
						}}
					>
						<Text size='xs' c='gray.3'>
							Fremskridt: {completionPercentage}% ({completedSkills}/{totalSkills})
						</Text>
					</Box>

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
