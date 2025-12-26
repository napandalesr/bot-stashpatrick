// Script simplificado que se inyecta automáticamente
(function() {
    console.log('[Turnstile Bypass] Inicializando...');
    
    // Mockear turnstile antes de que cargue el script real
    window.turnstile = {
        ready: (callback) => {
            console.log('[Bypass] turnstile.ready() mockeado');
            setTimeout(callback, 50);
        },
        
        render: function(container, options) {
            console.log('[Bypass] Renderizando Turnstile mock');
            
            const widgetId = 'mock-widget-' + Date.now();
            const mockToken = '1x00000000000000000000BY' + Date.now() + Math.random().toString(36).substr(2, 10);
            
            // Crear input oculto con token
            const existingInput = container.querySelector('input[name="cf-turnstile-response"]');
            if (!existingInput) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'cf-turnstile-response';
                input.id = 'cf-turnstile-response';
                input.value = mockToken;
                container.appendChild(input);
            } else {
                existingInput.value = mockToken;
            }
            
            // Disparar evento de éxito
            setTimeout(() => {
                const event = new Event('turnstile-success', { bubbles: true });
                container.dispatchEvent(event);
                
                // También evento global para scripts externos
                window.dispatchEvent(new CustomEvent('cf-turnstile-success', {
                    detail: { token: mockToken, widgetId: widgetId }
                }));
            }, 100);
            
            return widgetId;
        },
        
        remove: function(widgetId) {
            console.log('[Bypass] Eliminando widget:', widgetId);
            const inputs = document.querySelectorAll('input[name="cf-turnstile-response"]');
            inputs.forEach(input => input.remove());
        },
        
        reset: function(widgetId) {
            console.log('[Bypass] Reset widget:', widgetId);
            const input = document.querySelector('input[name="cf-turnstile-response"]');
            if (input) {
                input.value = '1x00000000000000000000RESET' + Date.now();
            }
        }
    };
    
    // Interceptar carga del script de Turnstile
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName === 'script') {
            const originalSetAttribute = element.setAttribute.bind(element);
            element.setAttribute = function(name, value) {
                if (name === 'src' && value && value.includes('turnstile')) {
                    console.log('[Bypass] Script de Turnstile bloqueado:', value);
                    // Reemplazar con función vacía
                    element.textContent = '// Turnstile bypassed';
                    return;
                }
                return originalSetAttribute(name, value);
            };
        }
        
        return element;
    };
    
    console.log('[Turnstile Bypass] Listo');
})();