export type Direction = 'import' | 'export';

export interface Country {
	code: string;
	name: string;
	flag: string;
	region: string;
	ecoCoefficient: number;
	cbamMultiplier?: number;
}

export type ProductCategory =
	| 'electronics'
	| 'plastics'
	| 'textiles'
	| 'metals'
	| 'chemicals';

export interface ProductCategoryData {
	code: ProductCategory;
	name: string;
	icon: string;
	baseFactor: number;
	co2PerKg: number;
}

export type PackagingMaterial =
	| 'cardboard'
	| 'pet'
	| 'aluminum'
	| 'glass'
	| 'wood';

export interface PackagingMaterialData {
	code: PackagingMaterial;
	name: string;
	recyclingRate: number;
	recyclability: number;
}

export interface CalculationInput {
	direction: Direction;
	countryCode: string;
	categoryCode: ProductCategory;
	productWeightKg: number;
	packagingCode: PackagingMaterial;
	packagingWeightGrams: number;
}

export interface CalculationBreakdown {
	productEcoFee: number;
	cbamCarbonFee: number;
	packagingRecyclingFee: number;
	subtotal: number;
	vatRate: number;
	vatAmount: number;
	total: number;
	country: Country;
	category: ProductCategoryData;
	packaging: PackagingMaterialData;
	co2EmissionKg: number;
}

export interface UsageStats {
	freeCalculationsUsed: number;
	hasSubscription: boolean;
	hasPdfLicense: boolean;
}
