'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
	return <MantineProvider>{children}</MantineProvider>;
}
