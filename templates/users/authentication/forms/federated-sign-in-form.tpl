<div class="form-group">

	<% if (config['federated_authentication_enabled']) { %>
	<label class="control-label"></label>
	<div class="controls">

		<button id="federated-signin" class="btn" style="margin-right:10px; margin-bottom:5px; float:left"><i class="fa fa-chevron-right"></i>Sign In With</button>

		<p style="display:none; margin-top:10px; margin-right:5px; float:left"><b>With</b></p>

		<div style="margin-top:5px; float:left">
			<div id="auth-provider-selector"></div>
		</div>

		<i style="margin-top:10px; margin-left:10px" class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Sign In With" data-content="If you already have a account with one of these identity providers, you can use your account to sign in to the SWAMP."></i>
	</div>
	<% } else if (config['github_authentication_enabled']) { %>
	<label class="control-label">Sign in with</label>
	<div class="controls">
		<button id="github-signin" class="btn"><i class="fa fa-github"></i>GitHub</button>
		<i class="active fa fa-question-circle" style="margin-left:10px" data-toggle="popover" data-placement="top" data-container="body" title="Sign in with GitHub" data-content="If you already have a GitHub account, you can use your GitHub account to sign in to the SWAMP."></i>
	</div>
	<% } %>
</div>
