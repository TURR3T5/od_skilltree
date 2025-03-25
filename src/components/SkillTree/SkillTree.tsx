import React, { useCallback, useRef } from 'react';
import { Box, Container, useMantineTheme, Stack } from '@mantine/core';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Controls, Background, NodeTypes, Connection, ReactFlowProvider, Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SkillTreeHeader } from './SkillTreeHeader';
import { SkillNode } from './SkillNode';
import { SkillTreeProps, SkillTreeData } from '../../types/SkillTypes';
import { calculateSkillTreeLayout, isSkillUnlockable } from '../../utils/skillTreeHelper';

const SkillTreeInner: React.FC<SkillTreeProps> = ({ data, onSkillUpgrade, onSkillDowngrade }) => {
	const theme = useMantineTheme();
	const reactFlowRef = useRef(null);

	const initialNodes = React.useMemo(() => {
		const layout = calculateSkillTreeLayout(data.skills);

		return data.skills.map((skill, index) => ({
			id: skill.id,
			type: 'skillNode',
			position: layout[index],
			data: {
				skill,
				onUpgrade: () => {
					onSkillUpgrade(skill.id);
				},
				onDowngrade: onSkillDowngrade ? () => onSkillDowngrade(skill.id) : undefined,
				isUpgradeable: isSkillUnlockable(skill, data.skills, data.playerLevel, data.availablePoints),
				playerLevel: data.playerLevel,
				availablePoints: data.availablePoints,
			} as SkillNode['data'],
		}));
	}, [data.skills, data.playerLevel, data.availablePoints, onSkillUpgrade, onSkillDowngrade]);

	const initialEdges = React.useMemo(
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
					animated: isPathUnlocked,
					style: {
						stroke: isPathUnlocked ? theme.colors.blue[6] : theme.colors.gray[7],
						strokeWidth: isPathUnlocked ? 3 : 2,
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

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	React.useEffect(() => {
		setNodes(initialNodes);
		setEdges(initialEdges);
	}, [data, initialNodes, initialEdges, setNodes, setEdges]);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((eds) => addEdge(connection, eds));
		},
		[setEdges]
	);

	const nodeTypes: NodeTypes = {
		skillNode: SkillNode,
	};

    interface ReactFlowInstance {
        fitView: (options?: { padding?: number }) => void;
    }

    const onInit = useCallback((instance: ReactFlowInstance) => {
        setTimeout(() => {
            instance.fitView({ padding: 0.2 });
        }, 200);
    }, []);

	return (
		<Container w={1000}>
			<Stack gap={0}>
				<SkillTreeHeader name={data.name} playerLevel={data.playerLevel} availablePoints={data.availablePoints} />

				<Box
					style={{
						height: '70vh',
						background: theme.colors.dark[8],
						borderBottomLeftRadius: theme.radius.md,
						borderBottomRightRadius: theme.radius.md,
					}}
				>
					<ReactFlow ref={reactFlowRef} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }} colorMode='dark' maxZoom={1.2} minZoom={0.75} onInit={onInit}>
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
