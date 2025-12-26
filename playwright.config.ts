import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    
    projects: [
        {
            name: 'chromium-turnstile-bypass',
            use: {
                ...devices['Desktop Chrome'],
                // Configuración personalizada para bypass
                launchOptions: {
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--disable-dev-shm-usage',
                        `--disable-extensions-except=${path.join(__dirname, 'src/extensions/turnstile-bypass')}`,
                        `--load-extension=${path.join(__dirname, 'src/extensions/turnstile-bypass')}`
                    ]
                }
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
    
    // Web server para desarrollo
    webServer: process.env.CI ? undefined : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});