<div class="username form-group">
	<label class="control-label">Username</label>
	<div class="col-sm-6 col-xs-12">
		<div class="input-group">
			<input type="text" class="form-control">
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered."></i>
			</div>
		</div>
		<% if (application.config.email_enabled) { %>
		<a id="request-username" class="fineprint">Request my username</a>
		<% } %>
	</div>
</div>

<div class="password form-group">
	<label class="control-label">Password</label>
	<div class="col-sm-6 col-xs-12">
		<div class="input-group">
			<input type="password" class="form-control" maxlength="200">
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="This is the password that you specified when you registered."></i>
			</div>
		</div>
		<% if (application.config.email_enabled && !application.config.ldap_readonly) { %>
		<a id="reset-password" class="fineprint">Reset my password</a>
		<% } %>
	</div>
</div>
</div>

<label style="display:block; text-align:center">Or</label>

<div class="linked-account form-group">
	<label class="control-label">Sign In With</label>
	<div class="col-sm-6 col-xs-12">
		<div class="buttons">

			<% if (show_google) { %>
			<button class="btn" type="button" id="google-sign-in" data-dismiss="modal"><i class="fa fa-google"></i>Google</button>
			<% } %>

			<% if (show_github) { %>
			<button class="btn" type="button" id="github-sign-in" data-dismiss="modal"><i class="fa fa-github"></i>GitHub</button>
			<% } %>

			<% if (show_other) { %>
			<button class="btn" type="button" id="other-sign-in" data-dismiss="modal"><i class="fa fa-users"></i>Other</button>
			<% } %>
		</div>
	</div>
</div>

<div class="alert alert-warning" style="display:none">
<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
</div>
