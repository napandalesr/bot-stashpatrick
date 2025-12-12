// login-manual-y-clicks-simultaneos.ts
//import axios from 'axios';
import { chromium } from 'playwright';

const main = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Navegar al login
  console.log('Abriendo página de login...');
  await page.goto('https://stashpatrick.im', { timeout: 0 });

  const now = new Date();
  const currentYear = now.getFullYear();

  const limitDate = new Date(currentYear, 11, 13); 

  if (now > limitDate) {
  await browser.close();

  } else {
    
    // Esperar a que aparezca el CAPTCHA y el formulario
    console.log('img[src^="https://stashpatrick.im/captcha"]...');
    await page.waitForSelector('img[src^="https://stashpatrick.im/captcha"]', { timeout: 0 });
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
    await page.goto('https://stashpatrick.im/cards/search?save=55132', { timeout: 0 });

    // Esperar a que cargue la página (ajusta selector si hay un indicador específico)
    //await page.waitForLoadState('networkidle');
    console.log('Página de búsqueda cargada.');

  //https://stashpatrick.gl
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
            console.log('Parámetros extraídos:', parametros);

            let promesas = parametros.map(function(card) {
              return new Promise(function(resolve, reject) {
                let token12 = $('input[name="_token"]').val();
                let dataSend = {
                  _token: token12,
                  card: card
                }

                $.ajax({
                  url: "https://stashpatrick.im/quickbuy",
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

};

main()
