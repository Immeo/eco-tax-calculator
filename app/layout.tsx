import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const theme = createTheme({
	fontFamily: 'Inter, sans-serif',
	fontFamilyMonospace: 'JetBrains Mono, monospace',
	primaryColor: 'dark',
	colors: {
		dark: [
			'#C1C2C5',
			'#A6A7AB',
			'#909296',
			'#5c5f66',
			'#373A40',
			'#2C2E33',
			'#25262B',
			'#1A1B1E',
			'#141517',
			'#101113'
		]
	},
	components: {
		Button: {
			defaultProps: {
				radius: 'lg'
			}
		},
		Card: {
			defaultProps: {
				radius: 'xl',
				withBorder: true
			}
		},
		Input: {
			defaultProps: {
				radius: 'lg'
			}
		},
		Select: {
			defaultProps: {
				radius: 'lg'
			}
		}
	}
});

export const metadata = {
	title: 'EcoTax Calculator 2026',
	description: 'Расчет экологических пошлин и налогов'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='ru'>
			<head>
				<ColorSchemeScript />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap'
					rel='stylesheet'
				/>
			</head>
			<body>
				<MantineProvider theme={theme}>
					<DatesProvider settings={{ locale: 'ru' }}>{children}</DatesProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
