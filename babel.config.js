/* eslint-env node */
module.exports = (api) => {
  const isTest = api.env('test');

  return {
    presets: [
      ['@babel/preset-env', { targets: { node: isTest ? '12' : 'current' } }],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  };
};
