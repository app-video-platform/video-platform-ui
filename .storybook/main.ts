import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.extensions)
      config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@emotion/is-prop-valid': path.resolve(
        __dirname,
        '../src/shared/utils/shims/emotion-is-prop-valid.ts',
      ),
    };
    // Prefer the plugin to stay in sync with tsconfig.json
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ];
    // SCSS (global)
    config.module!.rules!.push({
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: { importLoaders: 1, sourceMap: true },
        },
        {
          loader: require.resolve('sass-loader'),
          options: { sourceMap: true },
        },
      ],
    });

    // SCSS modules: name files like Something.module.scss
    config.module!.rules!.push({
      test: /\.module\.scss$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            sourceMap: true,
            modules: { localIdentName: '[local]__[hash:base64:5]' },
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: { sourceMap: true },
        },
      ],
    });

    return config;
  },
};
export default config;
