import { chromium, Page } from 'playwright';
import { cond } from './condition';
import * as os from 'os';
import * as path from 'path';

const main = async () => {
    // RUTAS COMUNES DE PERFILES DE CHROME
    const chromePaths = {
        windows: path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'User Data'),
        mac: path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome'),
        linux: path.join(os.homedir(), '.config', 'google-chrome')
    };
    
    let userDataDir: string;
    
    // Detectar sistema operativo
    const platform = os.platform();
    if (platform === 'win32') {
        userDataDir = chromePaths.windows;
        //console.log('Sistema: Windows');
    } else if (platform === 'darwin') {
        userDataDir = chromePaths.mac;
        //console.log('Sistema: macOS');
    } else {
        userDataDir = chromePaths.linux;
        //console.log('Sistema: Linux');
    }
    
    //console.log(`Perfil Chrome: ${userDataDir}`);
    
    try {
        // INTENTAR USAR TU CHROME REAL
        const browser = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            executablePath: getChromePath(), // Tu Chrome real, no Chromium
            args: [
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                // NO usar --remote-debugging-port (puede interferir)
            ],
            viewport: null, // Usar tamaño de ventana real
            ignoreDefaultArgs: [
                '--enable-automation',
                '--disable-background-networking'
            ]
        });
        
        const page = await browser.newPage();
        
        //console.log('Chrome REAL cargado con tu perfil');
        //console.log('Cloudflare te reconocerá como usuario legítimo\n');
        
        // Navegar
        //console.log('Abriendo stashpatrick.gl...');
        await page.goto('https://stashpatrick.gl', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        //console.log('Página cargada');
        
        if (cond()) {
            //console.log('\nAnalizando página...');
            
            // Verificar si hay CAPTCHA
            const hasCaptcha = await page.evaluate(() => {
                return document.querySelector('.cf-turnstile, iframe[src*="cloudflare"]') !== null;
            });
            
            if (hasCaptcha) {
                //console.log('Hay CAPTCHA (pero debería funcionar bien con tu perfil)');
                //console.log('\nINSTRUCCIONES:');
                //console.log('   1. Si aparece el CAPTCHA, resuélvelo NORMALMENTE');
                //console.log('   2. Haz click en "Ignore & Proceed"');
                //console.log('   3. Luego haz login normalmente');
                
                // Tomar screenshot
                await page.screenshot({ path: 'tu-chrome-captcha.png' });
                //console.log('Screenshot: tu-chrome-captcha.png');
            } else {
                console.log('¡No hay CAPTCHA! Cloudflare te reconoce');
                console.log('Puedes proceder directamente al login');
            }
        }
        
        //console.log('\nUsando tu Chrome REAL - Sin errores de automatización');
        //console.log('Presiona Ctrl+C cuando termines');
        
        await page.waitForTimeout(3000);
        
    } catch (error: any) {
        //console.error('Error usando Chrome real:', error.message);
        //console.log('\nIntentando método alternativo...');
        
        // Método alternativo: Chrome portable
        await fallbackMethod();
    }
};

const resolve = async (page: Page) => {
  if(cond()) {
    // Esperar a que aparezca el CAPTCHA y el formulario
    //console.log('img[src^="https://stashpatrick.gl/captcha"]...');
    await page.waitForSelector('img[src^="https://stashpatrick.gl/captcha"]', { timeout: 0 });
    console.log('\nFormulario visible:');
    console.log('→ Cuando termines, pulsa el botón "Login" manualmente.');

    // 2. Esperar a que TÚ completes el login manualmente
    console.log('Esperando a que inicies sesión...');

    await page.waitForSelector('input[name="login"][placeholder="Login"]', { timeout: 30000 });
    await page.fill('input[name="login"]', 'pia871717');

    await page.waitForSelector('input[name="password"][placeholder="Password"]', { timeout: 30000 });
    await page.fill('input[name="password"]', 'Bamguera2021-');
    try {
      // Detecta cambio de URL después de login exitoso (ajusta si la URL post-login es diferente)
      await page.waitForURL(url => !url.href.includes('/login'), { timeout: 0 });
    } catch {
      console.log('form.login100-form...');
      // Alternativa si se recarga la página: espera a que desaparezca el formulario de login
      await page.waitForSelector('form.login100-form', { state: 'detached', timeout: 0 });
    }
    console.log('Esperando a que inicies sesión...');

    await page.waitForSelector('input[name="secret"][placeholder="Your secret-key"]', { timeout: 30000 });
    await page.fill('input[name="secret"]', 'OHbWbzyRXRyaPtSyb0LMdvUWudg0gkNdk1Z5Wicy');//check-protect

    await page.getByRole('button', { name: 'Login' }).click();
    console.log('¡Login detectado! Navegando a /cards/search?save=...');

    
    // 3. Navegar a la página de búsqueda
    await page.goto('https://stashpatrick.gl/cards/search?save=55132', { timeout: 0 });

    // Esperar a que cargue la página (ajusta selector si hay un indicador específico)
    //await page.waitForLoadState('networkidle');
    console.log('Página de búsqueda cargada.');

    await page.addScriptTag({
    content: `
      window.quickbuy_send = function(){

            let parametros = [];
    
            $('a[onclick*="quickbuy"]').each(function() {
                let onclickText = $(this).attr('onclick');
                
                // Limpiar y extraer
                let codigo = onclickText.replace(/[^0-9]/g, '');
                
                if (codigo) {
                    parametros.push(codigo);
                }
            });

            let promesas = parametros.map(function(card) {
              return new Promise(function(resolve, reject) {
                let token12 = $('input[name="_token"]').val();
                let dataSend = {
                  _token: token12,
                  card: card
                }

                $.ajax({
                  url: "https://stashpatrick.gl/quickbuy",
                  method: 'post',
                  dataType: 'json',
                  data: dataSend,
                  success: function(data) {
                      resolve({
                          card: card,
                          data: data,
                          status: 'success'
                      });
                  },
                  error: function(error) {
                      resolve({
                          card: card,
                          error: error,
                          status: 'error'
                      });
                  }
                });
              })
            });
            return false;
        }
      `
    });
  }
}

// Obtener ruta de Chrome según sistema operativo
function getChromePath(): string {
    const platform = os.platform();
    
    if (platform === 'win32') {
        // Windows
        const paths = [
            path.join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
        ];
        
        for (const p of paths) {
            if (require('fs').existsSync(p)) return p;
        }
    } else if (platform === 'darwin') {
        // macOS
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else {
        // Linux
        return '/usr/bin/google-chrome';
    }
    
    return ''; // Usará Chromium por defecto
}

// Método alternativo si falla el principal
async function fallbackMethod() {
    console.log('🔄 Usando método alternativo...');
    
    const browser = await chromium.launch({
        headless: false,
        executablePath: getChromePath() || undefined, // Intentar con Chrome si está disponible
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox'
        ]
    });
    
    const page = await browser.newPage();
    
    // Intentar cargar algunas cookies/estado común
    await page.addInitScript(() => {
        // Simular comportamiento humano
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    await page.goto('https://stashpatrick.gl');
    
    console.log('✅ Método alternativo cargado');
    console.log('💡 Aún puede haber CAPTCHA, pero debería ser más fácil');
    
    if (cond()) {
        console.log('\n🎯 Si ves CAPTCHA:');
        console.log('   1. Resuélvelo manualmente');
        console.log('   2. Haz click en "Ignore & Proceed"');
        console.log('   3. Procede con el login');
        await resolve(page);
    }
    
    await page.waitForTimeout(3600000);
}

main().catch(console.error);