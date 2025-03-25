import React, { useState } from 'react';
import { Box, Tooltip, Text, useMantineTheme, Badge, Transition } from '@mantine/core';
import { SkillNodeProps } from '../../types/SkillNodeData';
import { SkillUpgradeModal } from './SkillUpgradeModal';

export const SkillNode: React.FC<SkillNodeProps> = ({ data }) => {
	const theme = useMantineTheme();
	const { skill, onUpgrade, isUpgradeable, playerLevel, availablePoints } = data.data;
	const SkillIcon = skill.icon;
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);

	const getNodeBackground = (): string => {
		if (skill.isUnlocked) {
			return skill.level === skill.maxLevel ? `linear-gradient(135deg, ${theme.colors.green[7]}, ${theme.colors.green[9]})` : `linear-gradient(135deg, ${theme.colors.blue[7]}, ${theme.colors.blue[9]})`;
		}
		return `linear-gradient(135deg, ${theme.colors.dark[5]}, ${theme.colors.dark[7]})`;
	};

	const handleNodeClick = (): void => {
		if (isUpgradeable) {
			setShowModal(true);
		}
	};

	const handleUpgrade = (): void => {
		setIsAnimating(true);
		onUpgrade();
		setTimeout(() => setIsAnimating(false), 500);
	};

	const requiredLevel = skill.level * 5;

	const getUpgradeGlow = (): string => {
		if (!isUpgradeable) return 'none';
		return `0 0 20px 5px ${theme.colors.green[5]}`;
	};

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
				c='white'
				bg={theme.colors?.dark[7]}
				style={{ border: `1px solid ${theme.colors?.dark[7]}` }}
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
						boxShadow: getUpgradeGlow(),
						':hover': {
							transform: isUpgradeable ? 'rotate(45deg) scale(1.05)' : 'rotate(45deg)',
						},
					}}
					onClick={handleNodeClick}
				>
					<Transition mounted={isAnimating} transition='pop' duration={500}>
						{(styles) => (
							<Box
								style={{
									...styles,
									position: 'absolute',
									width: '120%',
									height: '120%',
									background: 'rgba(76, 175, 80, 0.3)', // Soft green glow
									borderRadius: theme.radius.sm,
									zIndex: 10,
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
