import type {
	Country,
	PackagingMaterialData,
	ProductCategoryData
} from './types';

export const COUNTRIES: Country[] = [
	{
		code: 'EU',
		name: 'Европейский Союз (CBAM)',
		flag: '🇪',
		region: 'Europe',
		ecoCoefficient: 0.42,
		cbamMultiplier: 1.0
	},
	{
		code: 'CN',
		name: 'Китай',
		flag: '🇨',
		region: 'Asia',
		ecoCoefficient: 0.18
	},
	{
		code: 'US',
		name: 'США',
		flag: '🇺',
		region: 'North America',
		ecoCoefficient: 0.31
	},
	{
		code: 'AE',
		name: 'ОАЭ',
		flag: '🇦🇪',
		region: 'Middle East',
		ecoCoefficient: 0.22
	},
	{
		code: 'TR',
		name: 'Турция',
		flag: '🇹🇷',
		region: 'Europe/Asia',
		ecoCoefficient: 0.26
	},
	{
		code: 'CIS',
		name: 'СНГ (ЕАЭС)',
		flag: '🌐',
		region: 'Eurasia',
		ecoCoefficient: 0.14
	}
];

export const PRODUCT_CATEGORIES: ProductCategoryData[] = [
	{
		code: 'electronics',
		name: 'Электроника',
		icon: 'Cpu',
		baseFactor: 1.85,
		co2PerKg: 4.2
	},
	{
		code: 'plastics',
		name: 'Пластик и полимеры',
		icon: 'Package',
		baseFactor: 1.45,
		co2PerKg: 3.1
	},
	{
		code: 'textiles',
		name: 'Одежда и текстиль',
		icon: 'Shirt',
		baseFactor: 0.95,
		co2PerKg: 1.8
	},
	{
		code: 'metals',
		name: 'Металлы и сплавы',
		icon: 'Hammer',
		baseFactor: 2.1,
		co2PerKg: 5.6
	},
	{
		code: 'chemicals',
		name: 'Химическая продукция',
		icon: 'FlaskConical',
		baseFactor: 1.7,
		co2PerKg: 3.8
	}
];

export const PACKAGING_MATERIALS: PackagingMaterialData[] = [
	{
		code: 'cardboard',
		name: 'Картон / гофрокартон',
		recyclingRate: 0.12,
		recyclability: 0.92
	},
	{
		code: 'pet',
		name: 'ПЭТ-пластик',
		recyclingRate: 0.38,
		recyclability: 0.55
	},
	{
		code: 'aluminum',
		name: 'Алюминий',
		recyclingRate: 0.28,
		recyclability: 0.95
	},
	{
		code: 'glass',
		name: 'Стекло',
		recyclingRate: 0.18,
		recyclability: 0.88
	},
	{
		code: 'wood',
		name: 'Дерево / паллеты',
		recyclingRate: 0.09,
		recyclability: 0.8
	}
];

export const VAT_RATES: Record<string, number> = {
	EU: 0.2,
	CN: 0.13,
	US: 0.0,
	AE: 0.05,
	TR: 0.2,
	CIS: 0.18
};

export const CBAM_CARBON_PRICE_USD_PER_TON = 92;

export const FREE_CALCULATION_LIMIT = 3;
