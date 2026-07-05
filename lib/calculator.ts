import {
	CBAM_CARBON_PRICE_USD_PER_TON,
	COUNTRIES,
	PACKAGING_MATERIALS,
	PRODUCT_CATEGORIES,
	VAT_RATES
} from './tariffs';
import type { CalculationBreakdown, CalculationInput } from './types';

export function calculate(input: CalculationInput): CalculationBreakdown {
	const country = COUNTRIES.find(c => c.code === input.countryCode);
	const category = PRODUCT_CATEGORIES.find(c => c.code === input.categoryCode);
	const packaging = PACKAGING_MATERIALS.find(
		p => p.code === input.packagingCode
	);

	if (!country || !category || !packaging) {
		throw new Error('Invalid input data');
	}

	const packagingWeightKg = input.packagingWeightGrams / 1000;

	const productEcoFee =
		input.productWeightKg * country.ecoCoefficient * category.baseFactor;

	const isCbamApplicable =
		input.direction === 'import' &&
		country.code === 'EU' &&
		country.cbamMultiplier !== undefined;

	const co2EmissionKg = input.productWeightKg * category.co2PerKg;
	const cbamCarbonFee = isCbamApplicable
		? (co2EmissionKg / 1000) *
			CBAM_CARBON_PRICE_USD_PER_TON *
			country.cbamMultiplier!
		: 0;

	const packagingRecyclingFee = packagingWeightKg * packaging.recyclingRate;

	const subtotal = productEcoFee + cbamCarbonFee + packagingRecyclingFee;

	const vatRate = VAT_RATES[country.code] ?? 0;
	const vatAmount = subtotal * vatRate;

	const total = subtotal + vatAmount;

	return {
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
	};
}

export function formatUSD(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}

export function formatNumber(value: number, digits = 2): string {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
}

export function getShare(value: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((value / total) * 100);
}
