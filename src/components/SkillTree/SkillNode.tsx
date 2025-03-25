import React, { useState } from 'react';
import { Box, Tooltip, Text, useMantineTheme, Badge, Transition } from '@mantine/core';
import { NodeProps, Node } from '@xyflow/react';
import { Skill } from '../../types/SkillTypes';
import { SkillUpgradeModal } from './SkillUpgradeModal';

export interface SkillNode extends Node {
	type: 'skillNode';
	id: string;
	position: { x: number; y: number };
	data: {
		skill: Skill;
		onUpgrade: () => void;
		onDowngrade?: () => void;
		isUpgradeable: boolean;
		playerLevel: number;
		availablePoints: number;
	};
}

export const SkillNode: React.FC<NodeProps<SkillNode>> = ({ data }) => {
	const theme = useMantineTheme();
	const { skill, onUpgrade, isUpgradeable, playerLevel, availablePoints } = data;
	const SkillIcon = skill.icon;
	const [showModal, setShowModal] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const getNodeBackground = () => {
		if (skill.isUnlocked) {
			return skill.level === skill.maxLevel ? `linear-gradient(135deg, ${theme.colors.green[7]}, ${theme.colors.green[9]})` : `linear-gradient(135deg, ${theme.colors.blue[7]}, ${theme.colors.blue[9]})`;
		}
		return `linear-gradient(135deg, ${theme.colors.dark[5]}, ${theme.colors.dark[7]})`;
	};

	const handleNodeClick = () => {
		if (isUpgradeable) {
			setShowModal(true);
		}
	};

	const handleUpgrade = () => {
		setIsAnimating(true);
		onUpgrade();
		setTimeout(() => setIsAnimating(false), 1000);
	};

	const requiredLevel = skill.level * 5;

	return (
		<>
			<Tooltip
				label={
					<Box>
						<Text fw={700}>{skill.name}</Text>
						<Text size='sm'>{skill.description}</Text>
						<Text size='xs' mt={5}>
							Level: {skill.level}/{skill.maxLevel}
						</Text>
						{requiredLevel > 0 && (
							<Text size='xs' c={playerLevel >= requiredLevel ? 'green' : 'red'}>
								Required Level: {requiredLevel}
							</Text>
						)}
						<Text size='xs' c={availablePoints >= skill.cost ? 'green' : 'red'}>
							Cost: {skill.cost} points
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
						opacity: skill.isUnlocked ? 1 : 0.6,
						transition: 'all 0.3s ease',
						boxShadow: isAnimating ? `0 0 20px 5px ${theme.colors.blue[5]}` : isUpgradeable ? `0 0 10px 1px ${theme.colors.blue[3]}` : 'none',
						':hover': {
							transform: isUpgradeable ? 'rotate(45deg) scale(1.1)' : 'rotate(45deg)',
						},
					}}
					onClick={handleNodeClick}
				>
					<Transition mounted={isAnimating} transition='scale' duration={1000}>
						{(styles) => (
							<Box
								style={{
									...styles,
									position: 'absolute',
									width: '100%',
									height: '100%',
									background: 'rgba(255,255,255,0.3)',
									borderRadius: theme.radius.sm,
								}}
							/>
						)}
					</Transition>

					<Box
						style={{
							transform: 'rotate(-45deg)',
							color: 'white',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<SkillIcon size={32} weight={skill.isUnlocked ? 'fill' : 'regular'} />
						<Text ta='center' size='xs' mt={4}>
							{skill.level}/{skill.maxLevel}
						</Text>
						{!skill.isUnlocked && skill.requiredSkills && skill.requiredSkills.length > 0 && (
							<Badge size='xs' mt={4} color='gray'>
								Locked
							</Badge>
						)}
					</Box>
				</Box>
			</Tooltip>

			<SkillUpgradeModal skill={skill} isOpen={showModal} onClose={() => setShowModal(false)} onUpgrade={handleUpgrade} playerLevel={playerLevel} availablePoints={availablePoints} />
		</>
	);
};
