module.exports = {
	apps: [
		{
			name: 'MITM-Graph',
			script: './dist/main.js',
			max_memory_restart: '4G',
			watch: ['./dist'],
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
