const { build } = require('vite');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.production') });

async function buildRenderer() {
    try {
        await build({
            configFile: path.join(__dirname, '..', 'vite.config.js'), // Specify the config file
            root: path.join(__dirname, '..', 'src', 'renderer'), // Correct root path
            build: {
                outDir: path.join(__dirname, '..', 'build', 'renderer'),
            },
        });
        console.log('Renderer build complete.');
    } catch (error) {
        console.error('Error during build:', error);
        process.exit(1);
    }
}

buildRenderer();