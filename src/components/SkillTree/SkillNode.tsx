import React, { useState } from 'react';
import { Box, Tooltip, Text, useMantineTheme, Badge, Group } from '@mantine/core';
import { Handle, Position } from '@xyflow/react';
import { SkillNodeProps } from '../../types/SkillNodeData';
import { SkillUpgradeModal } from './SkillUpgradeModal';

export const SkillNode: React.FC<SkillNodeProps> = ({ data }) => {
	const theme = useMantineTheme();
	const { skill, onUpgrade, isUpgradeable, playerLevel, availablePoints, hasIncomingConnections } = data;
	const SkillIcon = skill.icon;
	const [showModal, setShowModal] = useState<boolean>(false);

	const getNodeBackground = (): string => {
		if (skill.isUnlocked) {
			if (skill.level === skill.maxLevel) {
				return `linear-gradient(135deg, ${theme.colors.green[7]}, ${theme.colors.green[9]})`;
			} else if (isUpgradeable) {
				return `linear-gradient(135deg, ${theme.colors.blue[5]}, ${theme.colors.blue[8]})`;
			} else {
				return `linear-gradient(135deg, ${theme.colors.blue[7]}, ${theme.colors.blue[9]})`;
			}
		}
		return `linear-gradient(135deg, ${theme.colors.dark[5]}, ${theme.colors.dark[7]})`;
	};

	const handleNodeClick = (): void => {
		if (skill.isUnlocked || isUpgradeable) {
			setShowModal(true);
		}
	};

	const getUpgradeGlow = (): string => {
		if (!isUpgradeable) return 'none';
		return `0 0 20px 5px ${theme.colors.green[5]}`;
	};

	const tooltipContent = (
		<Box>
			<Text fw={700}>{skill.name}</Text>
			<Text size='sm'>{skill.description}</Text>
			<Text size='xs' mt={5}>
				Niveau: {skill.level}/{skill.maxLevel}
			</Text>
			{skill.requiredLevel > 0 && (
				<Text size='xs' c={playerLevel >= skill.requiredLevel ? 'green' : 'red'}>
					Krævede niveau: {skill.requiredLevel}
				</Text>
			)}
			<Text size='xs' c={availablePoints >= skill.cost ? 'green' : 'red'}>
				Pris: {skill.cost} points
			</Text>
			{skill.requiredSkills && skill.requiredSkills.length > 0 && (
				<Box mt='xs'>
					<Text fw={600} size='xs'>
						Krævede skills:
					</Text>
					<Group gap='xs' mt={4}>
						{skill.requiredSkills.map((requiredSkillId) => {
							const requiredSkill = data.skills.find((s) => s.id === requiredSkillId);
							return requiredSkill ? (
								<Badge key={requiredSkillId} variant='light' color={requiredSkill.isUnlocked ? 'green' : 'red'} size='xs'>
									{requiredSkill.name}
								</Badge>
							) : null;
						})}
					</Group>
				</Box>
			)}
		</Box>
	);

	const nodeClassName = `skill-node ${isUpgradeable ? 'upgradeable' : ''}`;

	const innerBorderColor = skill.level === skill.maxLevel ? theme.colors.green[3] : skill.isUnlocked ? theme.colors.blue[3] : theme.colors.dark[3];

	return (
		<>
			{hasIncomingConnections && <Handle type='target' position={Position.Top} isConnectable={false} />}

			<Box className='node-container'>
				<Tooltip label={tooltipContent} multiline w={250} position='top' c='white' bg={theme.colors?.dark[7]} style={{ border: `1px solid ${theme.colors?.dark[7]}` }}>
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
							cursor: isUpgradeable || skill.isUnlocked ? 'pointer' : 'not-allowed',
							opacity: skill.isUnlocked ? 1 : 0.6,
							transition: 'all 0.3s ease',
							boxShadow: getUpgradeGlow(),
							border: `2px solid ${innerBorderColor}`,
						}}
						onClick={handleNodeClick}
						className={nodeClassName}
					>
						<Box
							style={{
								transform: 'rotate(-45deg)',
								color: 'white',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 2,
							}}
						>
							<Box>
								<SkillIcon size={32} weight={skill.isUnlocked ? 'fill' : 'regular'} color={skill.level === skill.maxLevel ? theme.colors.green[3] : undefined} />
							</Box>

							<Text ta='center' size='xs' mt={4} fw={600}>
								{skill.level}/{skill.maxLevel}
							</Text>

							{!skill.isUnlocked && (
								<Badge size='xs' mt={4} color='gray'>
									Låst
								</Badge>
							)}

							{skill.level === skill.maxLevel && (
								<Badge size='xs' mt={4} color='gray.2' variant='light'>
									Maks
								</Badge>
							)}
						</Box>
					</Box>
				</Tooltip>
			</Box>

			<Handle type='source' position={Position.Bottom} isConnectable={false} />

			<SkillUpgradeModal
				skill={skill}
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onUpgrade={() => {
					onUpgrade();
					setShowModal(false);
				}}
				playerLevel={playerLevel}
				availablePoints={availablePoints}
			/>
		</>
	);
};
