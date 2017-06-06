<% if( type == 'not-verified' ){ %>

	<h1>Linked Account Login Error</h1>
	<p>Your SWAMP account has not been verified.<br/><br/>
		Please check your email for a SWAMP account verification message and follow the enclosed instructions. If you cannot locate your verification email please do the following:</p>
	<ol>
		<li>Click the "Sign In" button located in the page header.</li>
		<li>Provide your SWAMP username and password and click OK.</li>
		<li>Review the "Email Verification Error" dialog and click "Resend" to send another copy of the verification email to your SWAMP email address.</li>
	</ol>
	<p>If problems persist, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } else if (type == 'not-enabled') { %>

	<h1>SWAMP Account Disabled</h1>
	<p>A SWAMP administrator disabled your SWAMP account.<br/>
	<p>If you feel this was in error, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } else if (type == 'linked-account-disabled') { %>

	<h1>SWAMP Linked Account Disabled</h1>
	<p>A SWAMP administrator disabled your linked account and you will not be able to use it for authentication at this time. Please sign in using your SWAMP credentials.<br/>
	<p>If you feel this was in error, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } else if (type == 'linked-account-auth-disabled') { %>

	<h1>SWAMP Linked Account Authentication Disabled</h1>
	<p>The SWAMP has disabled linked account authentication at the current time for security purposes.  Please sign in using your SWAMP credentials.<br/>
	<p>If you have questions or concerns, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } else if (type == 'linked-account-login-error') { %>

	<h1>Linked Account Login Error</h1>
	<p>There was a problem logging in to the selected Identity Provider.</p>
	<p>The login attempt may have timed out, or there may be an issue with the selected Identity Provider. Please try logging in again.</p>
	<p>If problems persist, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } else if (type == 'linked-account-general-error') { %>

	<h1>Linked Account Error</h1>
	<p>There was a problem with an external Identity Provider.</p>
	<p>One or more of the following errors may have occurred:</p>
	<ul>
		<li>You denied consent of attribute release from an Identity
		Provider.</li>
		<li>You attempted to access a URL without following the correct login
		flow for an external Identity Provider.</li>
		<li>A previously initiated login flow was not completed correctly.</li>
		<li>The Identity Provider authentication timed out requiring you to log
		in again.</li>
	</ul>
	<p>Please try logging in again.</p>
	<p>If problems persist, please contact our support staff at: <a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a>.</p>

<% } %>
