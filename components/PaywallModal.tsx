import { activatePdfLicense, activateSubscription } from '@/lib/storage';
import {
	Badge,
	Box,
	Button,
	Card,
	List,
	Modal,
	rem,
	Text,
	ThemeIcon,
	Title
} from '@mantine/core';
import { IconBolt, IconCheck, IconFileText } from '@tabler/icons-react'; // 👈 Заменил IconZap на IconBolt

interface PaywallModalProps {
	onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
	const handleSubscribe = () => {
		activateSubscription();
		onClose();
		window.location.reload();
	};

	const handlePdf = () => {
		activatePdfLicense();
		onClose();
		window.location.reload();
	};

	return (
		<Modal
			opened
			onClose={onClose}
			title={null}
			centered
			size='md'
			radius='xl'
			padding='xl'
			closeOnClickOutside={false}
		>
			<Box ta='center' mb='lg'>
				<Badge color='red' size='lg' mb='md'>
					Лимит исчерпан
				</Badge>
				<Title order={3} mb='xs'>
					Бесплатные расчёты закончились
				</Title>
				<Text c='dimmed'>
					Выберите тариф, чтобы продолжить работу с калькулятором.
				</Text>
			</Box>

			<Card
				withBorder
				padding='lg'
				radius='lg'
				mb='md'
				style={{ borderColor: 'var(--mantine-color-dark-filled)' }}
			>
				<Box style={{ position: 'absolute', top: -10, left: 20 }}>
					<Badge color='dark' size='sm'>
						РЕКОМЕНДУЕМ
					</Badge>
				</Box>

				<Box
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 16
					}}
				>
					<Box style={{ display: 'flex', gap: 12 }}>
						<ThemeIcon size='xl' radius='md' color='dark'>
							<IconBolt style={{ width: rem(20), height: rem(20) }} />{' '}
							{/* 👈 Здесь тоже */}
						</ThemeIcon>
						<Box>
							<Title order={4}>Подписка Pro</Title>
							<Text size='sm' c='dimmed'>
								Безлимитные расчёты + PDF
							</Text>
						</Box>
					</Box>
					<Box ta='right'>
						<Title order={3}>$19</Title>
						<Text size='xs' c='dimmed'>
							/мес
						</Text>
					</Box>
				</Box>

				<List
					spacing='xs'
					size='sm'
					center
					icon={
						<ThemeIcon color='green' size={20} radius='xl'>
							<IconCheck style={{ width: rem(12), height: rem(12) }} />
						</ThemeIcon>
					}
					mb='md'
				>
					<List.Item>Неограниченные расчёты</List.Item>
					<List.Item>Все PDF-декларации</List.Item>
					<List.Item>История операций</List.Item>
					<List.Item>Приоритетные ставки 2026</List.Item>
				</List>

				<Button onClick={handleSubscribe} color='dark' fullWidth size='md'>
					Оформить подписку
				</Button>
			</Card>

			<Card withBorder padding='lg' radius='lg' mb='md'>
				<Box
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 16
					}}
				>
					<Box style={{ display: 'flex', gap: 12 }}>
						<ThemeIcon size='xl' radius='md' variant='light'>
							<IconFileText style={{ width: rem(20), height: rem(20) }} />
						</ThemeIcon>
						<Box>
							<Title order={4}>Разовый PDF-отчёт</Title>
							<Text size='sm' c='dimmed'>
								Официальная декларация для таможни
							</Text>
						</Box>
					</Box>
					<Box ta='right'>
						<Title order={3}>$49</Title>
						<Text size='xs' c='dimmed'>
							разово
						</Text>
					</Box>
				</Box>

				<Button onClick={handlePdf} variant='outline' fullWidth size='md'>
					Купить PDF-лицензию
				</Button>
			</Card>
		</Modal>
	);
}
