import React from 'react';
import { Modal, Button, Group, Stack, Text, Box, Progress } from '@mantine/core';
import { Skill } from '../../types/SkillTypes';

interface SkillUpgradeModalProps {
	skill: Skill;
	isOpen: boolean;
	onClose: () => void;
	onUpgrade: () => void;
	playerLevel: number;
	availablePoints: number;
}

export const SkillUpgradeModal: React.FC<SkillUpgradeModalProps> = ({ skill, isOpen, onClose, onUpgrade, playerLevel, availablePoints }) => {
	const SkillIcon = skill.icon;

	const handleUpgrade = () => {
		onUpgrade();
		onClose();
	};

	const requiredLevel = skill.level * 5;
	const canAfford = availablePoints >= skill.cost;
	const hasLevel = playerLevel >= requiredLevel;

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Group>
					<SkillIcon size={24} />
					<Text fw={700}>{skill.name}</Text>
				</Group>
			}
			centered
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 3,
			}}
		>
			<Stack>
				<Text>{skill.description}</Text>

				<Group>
					<Text fw={600}>Level:</Text>
					<Text>
						{skill.level} / {skill.maxLevel}
					</Text>
				</Group>

				<Progress value={(skill.level / skill.maxLevel) * 100} color={skill.level === skill.maxLevel ? 'green' : 'blue'} />

				<Box my='md'>
					<Text fw={600} mb='xs'>
						Upgrade Requirements:
					</Text>

					<Group gap='xs'>
						<Text size='sm' c={hasLevel ? 'green' : 'red'}>
							Required Level: {requiredLevel}
						</Text>
					</Group>

					<Text size='sm' c={canAfford ? 'green' : 'red'}>
						Cost: {skill.cost} points
					</Text>

					{skill.requiredSkills && skill.requiredSkills.length > 0 && <Text size='sm'>Required Skills: Unlocked</Text>}
				</Box>

				<Group justify='flex-end' mt='md'>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleUpgrade} disabled={skill.level >= skill.maxLevel || !canAfford || !hasLevel}>
						Upgrade
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
};
