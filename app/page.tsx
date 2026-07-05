'use client';

import {
	Badge,
	Box,
	Button,
	Card,
	Container,
	Group,
	NumberInput,
	Progress,
	Select,
	SimpleGrid,
	Stepper,
	Text,
	ThemeIcon,
	Title,
	rem
} from '@mantine/core';
import {
	IconArrowLeft,
	IconArrowRight,
	IconBuildingFactory,
	IconCheck,
	IconDownload,
	IconLeaf,
	IconPackage,
	IconReceipt,
	IconRefresh
} from '@tabler/icons-react';
import { useState } from 'react';

import PaywallModal from '@/components/PaywallModal';
import { calculate, formatUSD, getShare } from '@/lib/calculator';
import { generatePdf } from '@/lib/pdf';
import {
	canCalculate,
	getRemainingFree,
	incrementCalculation
} from '@/lib/storage';
import {
	COUNTRIES,
	PACKAGING_MATERIALS,
	PRODUCT_CATEGORIES
} from '@/lib/tariffs';
import type { CalculationBreakdown, CalculationInput } from '@/lib/types';

const INITIAL_INPUT: CalculationInput = {
	direction: 'import',
	countryCode: 'EU',
	categoryCode: 'electronics',
	productWeightKg: 100,
	packagingCode: 'cardboard',
	packagingWeightGrams: 500
};

export default function Home() {
	const [activeStep, setActiveStep] = useState(0);
	const [input, setInput] = useState<CalculationInput>(INITIAL_INPUT);
	const [breakdown, setBreakdown] = useState<CalculationBreakdown | null>(null);
	const [showPaywall, setShowPaywall] = useState(false);
	const remaining = getRemainingFree();

	const updateInput = <K extends keyof CalculationInput>(
		key: K,
		value: CalculationInput[K]
	) => {
		setInput(prev => ({ ...prev, [key]: value }));
	};

	const handleNext = () => {
		if (activeStep === 2) {
			if (!canCalculate()) {
				setShowPaywall(true);
				return;
			}
			incrementCalculation();
			setBreakdown(calculate(input));
		}
		if (activeStep < 3) setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		if (activeStep > 0) setActiveStep(activeStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setInput(INITIAL_INPUT);
		setBreakdown(null);
	};

	const handleDownloadPdf = () => {
		if (breakdown) {
			generatePdf(breakdown);
		}
	};

	return (
		<Box bg='gray.0' miw='100vw' mih='100vh'>
			{/* Header */}
			<Box bg='white' style={{ borderBottom: '1px solid #e9ecef' }}>
				<Container size='lg' py='lg'>
					<Group justify='space-between'>
						<Group gap='xs'>
							<ThemeIcon size='lg' radius='md' color='dark'>
								<IconLeaf style={{ width: rem(18), height: rem(18) }} />
							</ThemeIcon>
							<Title order={4} fw={600}>
								EcoTax
								<Text span c='dimmed' size='sm' ml='xs'>
									/ 2026
								</Text>
							</Title>
						</Group>
						<Badge
							variant='light'
							color={remaining > 0 ? 'green' : 'red'}
							size='lg'
							radius='md'
						>
							{remaining === Infinity
								? '∞ Безлимит'
								: `Осталось: ${remaining} из 3`}
						</Badge>
					</Group>
				</Container>
			</Box>

			{/* Hero */}
			<Container size='lg' py='xl'>
				{/* ✅ ИСПРАВЛЕНО: обернул иконку в Box вместо marginRight */}
				<Box ta='center' mb='md'>
					<Box
						display='inline-flex'
						c='green.7'
						style={{ gap: 6, alignItems: 'center' }}
					>
						<IconLeaf style={{ width: rem(14), height: rem(14) }} />
						<Text size='sm' fw={500} c='green.7'>
							Тарифы актуальны на 2026 год
						</Text>
					</Box>
				</Box>

				<Title
					ta='center'
					order={1}
					size='h1'
					fw={600}
					mb='md'
					style={{ letterSpacing: '-0.02em' }}
				>
					Эко-пошлины и налоги
					<br />
					<Text span c='dimmed'>
						за секунду.
					</Text>
				</Title>
				<Text ta='center' c='dimmed' size='lg' mx='auto' maw={600}>
					Мгновенный расчёт CBAM, EPR и импортных сборов для ЕС, Китая, США,
					ОАЭ, Турции и СНГ.
				</Text>
			</Container>

			{/* Calculator */}
			<Container size='md' pb='xl'>
				<Card shadow='sm' padding='xl' radius='xl' withBorder>
					{/* ✅ ИСПРАВЛЕНО: убран breakpoint (нет в Mantine v7+) */}
					<Stepper
						active={activeStep}
						onStepClick={setActiveStep}
						size='sm'
						mb='xl'
						color='dark'
					>
						<Stepper.Step label='Направление' description='Страна и тип'>
							<StepDirection input={input} onChange={updateInput} />
						</Stepper.Step>
						<Stepper.Step label='Товар' description='Категория и вес'>
							<StepProduct input={input} onChange={updateInput} />
						</Stepper.Step>
						<Stepper.Step label='Упаковка' description='Материал'>
							<StepPackaging input={input} onChange={updateInput} />
						</Stepper.Step>
						<Stepper.Completed>
							{breakdown && (
								<StepResults
									breakdown={breakdown}
									onReset={handleReset}
									onDownloadPdf={handleDownloadPdf}
								/>
							)}
						</Stepper.Completed>
					</Stepper>

					{/* Navigation */}
					{activeStep < 3 && (
						<Group justify='space-between' mt='xl'>
							<Button
								variant='subtle'
								onClick={handleBack}
								disabled={activeStep === 0}
								leftSection={<IconArrowLeft size={16} />}
							>
								Назад
							</Button>

							<Button
								onClick={handleNext}
								color='dark'
								rightSection={
									activeStep < 2 ? <IconArrowRight size={16} /> : undefined
								}
								size='md'
							>
								{activeStep === 2 ? 'Рассчитать' : 'Далее'}
							</Button>
						</Group>
					)}
				</Card>
			</Container>

			{showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
		</Box>
	);
}

// Step 1: Direction
function StepDirection({
	input,
	onChange
}: {
	input: CalculationInput;
	onChange: <K extends keyof CalculationInput>(
		key: K,
		value: CalculationInput[K]
	) => void;
}) {
	return (
		<Box>
			<Title order={3} mb='xs'>
				Направление поставки
			</Title>
			<Text c='dimmed' size='sm' mb='lg'>
				Выберите тип операции и страну назначения/отправления.
			</Text>

			<SimpleGrid cols={2} mb='lg'>
				<Card
					padding='lg'
					radius='md'
					withBorder
					style={{
						cursor: 'pointer',
						borderColor:
							input.direction === 'import'
								? 'var(--mantine-color-dark-filled)'
								: undefined,
						backgroundColor:
							input.direction === 'import'
								? 'var(--mantine-color-dark-light)'
								: undefined
					}}
					onClick={() => onChange('direction', 'import')}
				>
					<Text fw={600} mb='xs'>
						Импорт
					</Text>
					<Text size='sm' c='dimmed'>
						Ввоз товара в страну
					</Text>
				</Card>
				<Card
					padding='lg'
					radius='md'
					withBorder
					style={{
						cursor: 'pointer',
						borderColor:
							input.direction === 'export'
								? 'var(--mantine-color-dark-filled)'
								: undefined,
						backgroundColor:
							input.direction === 'export'
								? 'var(--mantine-color-dark-light)'
								: undefined
					}}
					onClick={() => onChange('direction', 'export')}
				>
					<Text fw={600} mb='xs'>
						Экспорт
					</Text>
					<Text size='sm' c='dimmed'>
						Вывоз товара из страны
					</Text>
				</Card>
			</SimpleGrid>

			<Select
				label='Страна'
				placeholder='Выберите страну'
				data={COUNTRIES.map(c => ({
					value: c.code,
					label: `${c.flag} ${c.name}`
				}))}
				value={input.countryCode}
				onChange={value => value && onChange('countryCode', value)}
				mb='lg'
			/>
		</Box>
	);
}

// Step 2: Product
function StepProduct({
	input,
	onChange
}: {
	input: CalculationInput;
	onChange: <K extends keyof CalculationInput>(
		key: K,
		value: CalculationInput[K]
	) => void;
}) {
	return (
		<Box>
			<Title order={3} mb='xs'>
				Параметры товара
			</Title>
			<Text c='dimmed' size='sm' mb='lg'>
				Укажите категорию и чистый вес партии.
			</Text>

			<Select
				label='Категория товара'
				placeholder='Выберите категорию'
				data={PRODUCT_CATEGORIES.map(c => ({
					value: c.code,
					label: c.name
				}))}
				value={input.categoryCode}
				onChange={value => value && onChange('categoryCode', value)}
				mb='lg'
			/>

			<NumberInput
				label='Чистый вес товара'
				placeholder='0'
				value={input.productWeightKg}
				onChange={value => onChange('productWeightKg', Number(value))}
				min={0}
				step={0.1}
				rightSection='кг'
				mb='lg'
			/>
		</Box>
	);
}

// Step 3: Packaging
function StepPackaging({
	input,
	onChange
}: {
	input: CalculationInput;
	onChange: <K extends keyof CalculationInput>(
		key: K,
		value: CalculationInput[K]
	) => void;
}) {
	return (
		<Box>
			<Title order={3} mb='xs'>
				Параметры упаковки
			</Title>
			<Text c='dimmed' size='sm' mb='lg'>
				Укажите материал и вес упаковки (учитывается EPR-сбор).
			</Text>

			<Select
				label='Материал упаковки'
				placeholder='Выберите материал'
				data={PACKAGING_MATERIALS.map(m => ({
					value: m.code,
					label: m.name
				}))}
				value={input.packagingCode}
				onChange={value => value && onChange('packagingCode', value)}
				mb='lg'
			/>

			<NumberInput
				label='Вес упаковки'
				placeholder='0'
				value={input.packagingWeightGrams}
				onChange={value => onChange('packagingWeightGrams', Number(value))}
				min={0}
				step={10}
				rightSection='г'
				mb='lg'
			/>
		</Box>
	);
}

// Step 4: Results
function StepResults({
	breakdown,
	onReset,
	onDownloadPdf
}: {
	breakdown: CalculationBreakdown;
	onReset: () => void;
	onDownloadPdf: () => void;
}) {
	const {
		productEcoFee,
		cbamCarbonFee,
		packagingRecyclingFee,
		subtotal,
		vatRate,
		vatAmount,
		total,
		country,
		category,
		packaging,
		co2EmissionKg
	} = breakdown;

	const rows = [
		{
			label: 'Эко-сбор за товар',
			value: productEcoFee,
			icon: IconLeaf,
			color: 'green' as const,
			detail: `${country.ecoCoefficient} × ${category.baseFactor}`
		},
		...(cbamCarbonFee > 0
			? [
					{
						label: 'CBAM углеродный налог',
						value: cbamCarbonFee,
						icon: IconBuildingFactory,
						color: 'orange' as const,
						detail: `${co2EmissionKg.toFixed(1)} кг CO₂`
					}
				]
			: []),
		{
			label: 'EPR-сбор за упаковку',
			value: packagingRecyclingFee,
			icon: IconPackage,
			color: 'blue' as const,
			detail: packaging.name
		},
		{
			label: `НДС (${(vatRate * 100).toFixed(0)}%)`,
			value: vatAmount,
			icon: IconReceipt,
			color: 'gray' as const,
			detail: country.name
		}
	];

	return (
		<Box>
			<Badge
				color='green'
				size='lg'
				mb='md'
				leftSection={<IconCheck size={14} />}
			>
				РАСЧЁТ ЗАВЕРШЁН
			</Badge>

			<Title order={3} mb='xs'>
				Итоговая эко-пошлина
			</Title>
			<Text c='dimmed' size='sm' mb='lg'>
				{country.flag} {country.name} · {category.name}
			</Text>

			{/* Total */}
			<Card bg='dark' c='white' padding='xl' radius='lg' mb='lg'>
				<Text size='sm' c='dark.2' mb='xs'>
					К оплате
				</Text>
				<Title order={2} c='white' mb='xs'>
					{formatUSD(total)}
				</Title>
				<Text size='sm' c='dark.2'>
					Включая НДС {formatUSD(vatAmount)}
				</Text>
			</Card>

			{/* ✅ ИСПРАВЛЕНО: Progress.Root + Progress.Section вместо sections */}
			<Text size='sm' fw={500} mb='xs'>
				Структура платежа
			</Text>
			<Progress.Root size='xl' radius='md' mb='lg'>
				{rows.map((r, idx) => (
					<Progress.Section
						key={idx}
						value={getShare(r.value, total)}
						color={r.color}
					/>
				))}
			</Progress.Root>

			{/* Details */}
			<Box mb='lg'>
				{rows.map((row, idx) => {
					const Icon = row.icon;
					return (
						<Card key={idx} padding='md' withBorder mb='xs' radius='md'>
							<Group>
								<ThemeIcon color={row.color} variant='light' radius='md'>
									<Icon style={{ width: rem(18), height: rem(18) }} />
								</ThemeIcon>
								<Box style={{ flex: 1 }}>
									<Text fw={500} size='sm'>
										{row.label}
									</Text>
									<Text size='xs' c='dimmed'>
										{row.detail}
									</Text>
								</Box>
								<Text fw={600} size='sm'>
									{formatUSD(row.value)}
								</Text>
							</Group>
						</Card>
					);
				})}
			</Box>

			{/* CO2 */}
			<Card bg='green.0' padding='md' radius='md' mb='lg'>
				<Group>
					<ThemeIcon color='green' variant='light'>
						<IconBuildingFactory style={{ width: rem(18), height: rem(18) }} />
					</ThemeIcon>
					<Box>
						<Text fw={500} size='sm'>
							Углеродный след партии
						</Text>
						<Text size='xs' c='green.7'>
							{co2EmissionKg.toFixed(1)} кг CO₂ эквивалент
						</Text>
					</Box>
				</Group>
			</Card>

			{/* Actions */}
			<Group>
				<Button
					onClick={onDownloadPdf}
					color='dark'
					flex={1}
					leftSection={<IconDownload size={18} />}
				>
					Скачать PDF
				</Button>
				<Button
					onClick={onReset}
					variant='outline'
					flex={1}
					leftSection={<IconRefresh size={18} />}
				>
					Новый расчёт
				</Button>
			</Group>
		</Box>
	);
}
