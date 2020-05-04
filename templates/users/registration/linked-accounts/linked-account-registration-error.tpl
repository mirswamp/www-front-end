<h1>Linked Account Registration Error</h1>

<% if (type == 'account-exists') { %>

	<h2>Account Exists</h2>
	<p>You have already created an account associated with <%= provider %>.  To sign in, click the "Sign In" button and select your identity provider. </p>

<% } else if (type == 'email-exists') { %>

	<h2>Email Address Already In Use</h2>
	<p>An account has already been created using the email address associated with your <%= provider %> account.  Each account must be associated with a unique email address. </p>

<% } else if (type == 'no-provider') { %>

	<h2>No Identity Provider</h2>
	<p>This identity provider is not supported.  Please sign in using another provider or your username/password credentials. <br/>

<% } else if (type == 'provider-disabled') { %>

	<h2>Identity Provider Disabled</h2>
	<p>We have disabled your linked account identity provider at the current time.  Please sign in using another provider or your username/password credentials.<br/>

<% } else { %>

	<h2>Unknown Error</h2>
	<p>There was a problem with your external identity provider.</p>
	<p>One or more of the following errors may have occurred:</p>
	<ul>
		<li>You denied consent of attribute release from your identity provider.</li>
		<li>The identity provider authentication timed out requiring you to log in again.</li>
		<li>You attempted to access a URL without following the registration process.</li>
	</ul>
	<p>Please try registering again.</p>

<% } %>