import path from 'path';
import { defineConfig } from 'vite';
import packageJson from './package.json';

const getPackageName = () => {
    return packageJson.name.split('/').pop() ?? packageJson.name;
};

const getPackageNameCamelCase = () => {
    try {
        return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
    } catch (err) {
        throw new Error('Name property in package.json is missing.');
    }
};

const fileName = {
    es: `${getPackageName()}.mjs`,
    cjs: `${getPackageName()}.cjs`,
    iife: `${getPackageName()}.iife.js`,
};

export default defineConfig({
    server: {
        cors: { origin: '*' },
    },
    base: './',
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
            name: getPackageNameCamelCase(),
            formats: ['es', 'cjs', 'iife'],
            fileName: (format) => fileName[format],
        },
        rollupOptions: {
            external: ['lodash', 'axios'],
            output: {
                globals: {
                    lodash: 'Lodash',
                    axios: 'Axios',
                },
            },
        },
    },
});
