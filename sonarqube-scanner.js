const scanner = require('sonarqube-scanner');
scanner(
	{
		serverUrl: "http://localhost:9000",
		login: "admin",
		password: "test123",
		options: {
			"sonar.login": "admin",
			"sonar.password": "test123",
			"sonar.sources": "./src",
			'sonar.projectName': 'ISDP',
			'sonar.projectDescription': 'ISDP React COde',
		},
	},
	() => process.exit()
);