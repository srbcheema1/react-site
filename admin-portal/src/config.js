const dev = {
	SERVICE_ENDPOINTS: {
		"cs-auth": "https://api-qa.codehall.in/auth",
		"copdg": "https://api-qa.codehall.in/copdg",
		"assessment": "https://api-qa.codehall.in/assessment",
		"code-exec": "https://api-qa.codehall.in/code-exec"
	},
	ANALYTICS_ID: "UA-126186364-1",
	STAGE: "dev"
};

const prod = {
	STAGE: "prod",
	SERVICE_ENDPOINTS: {
		"cs-auth": "https://api.codehall.in/auth",
		"copdg": "https://api.codehall.in/copdg",
		"assessment": "https://api.codehall.in/assessment",
		"code-exec": "https://api.codehall.in/code-exec"
	},
	ANALYTICS_ID: "UA-126186364-1",
};

export const local_overrides = {
	...dev,
	/* uncomment and add your service endpoints here
		 make sure you have a file named .env.development.local where
		 REACT_APP_STAGE is set to local*/ 
	SERVICE_ENDPOINTS: {
		...dev['SERVICE_ENDPOINTS'],
		"cs-auth": "https://localhost/auth",
		"copdg": "https://localhost/copdg",
		"assessment": "https://localhost/assessment",
		"code-exec": "https://localhost/code-exec"
	},
};

let config = null
if (process.env.REACT_APP_STAGE === 'prod') {
	config = prod
}
else if (process.env.REACT_APP_STAGE === 'qa') {
	config = dev
}
else {
	config = local_overrides
}


export default {
	// Add common config values here
	MAX_ATTACHMENT_SIZE: 5000000,
	...config
};