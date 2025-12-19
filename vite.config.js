import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'; // 👈 1. IMPORT REACT PLUGIN
import path from 'path';                // 👈 2. IMPORT PATH MODULE

export default defineConfig({
    plugins: [
        laravel({
            // 3. UPDATE INPUT: Change 'app.css' to 'global.css' 
            //    and ensure it's in resources/css/
            input: ['resources/css/global.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(), // 👈 4. USE REACT PLUGIN
    ],
    
    // 👈 5. ADD RESOLVE BLOCK FOR ALIASING
    resolve: {
        alias: {
            // This alias allows you to reference the resources directory 
            // using the '~' symbol in your imports (e.g., import '~/css/global.css')
            '~': path.resolve(__dirname, 'resources'), 
        },
    },
});