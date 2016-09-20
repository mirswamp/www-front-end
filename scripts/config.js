/******************************************************************************\
|                                                                              |
|                                    config.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This config provides a way to share configuration information.        |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2013 SWAMP - Software Assurance Marketplace         |
\******************************************************************************/


define([
], function() {
	return {

		// web services
		//
		servers: {
			rws: 'http://localhost:8000/swamp-web-server/public',
			csa: 'http://localhost:8000/swamp-web-server/public',
			//api: 'http://localhost/api-doc-server/public',
		},

		// contact information
		//
		contact: {
			
			support: {
				email: "support@continuousassurance.org",
				phoneNumber: "317-274-3942",
				description: 'our 24/7 support staff',
				message: "Feel free to contact us with questions, suggested improvements, new feature ideas, praise, criticism, or whatever thoughts you wish to share.",
			},
			
			security: {
				email: "security@continuousassurance.org",
				phoneNumber: "317-274-3942",
				description: "our security team",
				message: "You may encrypt your email for privacy using GPG (Key id#739202FA, fingerprint 2793 A0A7 4340 7587 FC2A&nbsp;&nbsp;160F FE83 C695 7392 02FA)."
			}
		},

		// cookie for storing user session
		//
		cookie: {
			name: 'swampuuid',

			// the major domain to communicate across; null for default
			//
			domain: null,

			// the default path
			//
			path: '/',

			// set cookies secure; false for http (local) install
			//
			secure: false
		},

		// options flags
		//
		options: {
			assessments: {
				allow_multiple_tool_selection: true,
				allow_viewing_zero_weaknesses: true
			},
		}
	};
});

