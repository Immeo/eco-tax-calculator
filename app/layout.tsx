import '@mantine/core/styles.css';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';

export const metadata: Metadata = {
	title: 'EcoTax Calculator 2026',
	description: 'Расчет экологических пошлин и налогов'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<DatesProvider settings={{ locale: 'ru' }}>{children}</DatesProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
