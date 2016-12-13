<% if (config['linked_accounts_enabled']) { %>

<div class="form-group local-account" id="sign-in-with">
	<label class="control-label">Or Sign In With</label>
	<div class="controls">
		<div class="buttons">
			<% if (config['github_authentication_enabled']) { %>
			<button class="btn" type="button" id="github-sign-in" tabindex="3"><i class="fa fa-github"></i>GitHub</button>
			<% } %>
			<% if (config['google_authentication_enabled']) { %>
			<button class="btn" type="button" id="google-sign-in" tabindex="4"><i class="fa fa-google"></i>Google</button>
			<% } %>
			<% if (config['ci_logon_authentication_enabled']) { %>
			<button class="btn" type="button" id="select-sign-in" tabindex="5"><i class="fa fa-chevron-right"></i>Select...</button>
			<% } %>
		</div>
	</div>
</div>

<div class="linked-account" id="select-auth-provider" style="display:none">
	<div class="form-group">
		<label class="control-label">Sign In With</label>
		<div class="controls">
			<div id="auth-provider-selector" style="float:left"></div>
			<i style="margin-top:5px; margin-left:10px" class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Sign In With" data-content="If you already have a account with one of these identity providers, you can use your account to sign in to the SWAMP."></i>
		</div>
	</div>

	<div class="form-group" id="username-password">
		<label class="control-label">Or</label>
		<div class="controls">
			<button class="btn"><i class="fa fa-chevron-left"></i>Username / Password</button>
		</div>
	</div>
</div>
<% } %>