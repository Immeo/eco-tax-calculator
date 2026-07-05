import { FREE_CALCULATION_LIMIT } from './tariffs';
import type { UsageStats } from './types';

const STORAGE_KEY = 'ecotax_usage_v1';

const DEFAULT_STATS: UsageStats = {
	freeCalculationsUsed: 0,
	hasSubscription: false,
	hasPdfLicense: false
};

export function getUsageStats(): UsageStats {
	if (typeof window === 'undefined') return DEFAULT_STATS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_STATS;
		return { ...DEFAULT_STATS, ...JSON.parse(raw) };
	} catch {
		return DEFAULT_STATS;
	}
}

export function saveUsageStats(stats: UsageStats): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function canCalculate(): boolean {
	const stats = getUsageStats();
	return (
		stats.hasSubscription || stats.freeCalculationsUsed < FREE_CALCULATION_LIMIT
	);
}

export function canDownloadPdf(): boolean {
	const stats = getUsageStats();
	return stats.hasPdfLicense || stats.hasSubscription;
}

export function incrementCalculation(): UsageStats {
	const stats = getUsageStats();
	if (!stats.hasSubscription) {
		stats.freeCalculationsUsed += 1;
	}
	saveUsageStats(stats);
	return stats;
}

export function activateSubscription(): UsageStats {
	const stats = {
		...getUsageStats(),
		hasSubscription: true,
		hasPdfLicense: true
	};
	saveUsageStats(stats);
	return stats;
}

export function activatePdfLicense(): UsageStats {
	const stats = {
		...getUsageStats(),
		hasPdfLicense: true
	};
	saveUsageStats(stats);
	return stats;
}

export function getRemainingFree(): number {
	const stats = getUsageStats();
	if (stats.hasSubscription) return Infinity;
	return Math.max(0, FREE_CALCULATION_LIMIT - stats.freeCalculationsUsed);
}
