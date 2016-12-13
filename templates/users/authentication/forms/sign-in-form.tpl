<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert" tabindex="-1"><i class="fa fa-close"></i></button>
	<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
</div>

<div class="alert alert-info" style="display:none">
	<button type="button" class="close" data-dismiss="alert" tabindex="-1"><i class="fa fa-close"></i></button>
	<label>Notification: </label><span class="message"></span>
</div>

<div class="form-group local-account" id="username">
	<label class="control-label">Username</label>
	<div class="controls">
		<div class="input-group">
			<input type="text" class="form-control">
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered with the SWAMP."></i>
			</div>
		</div>
		<% if (config['email_enabled']) { %>
		<a id="request-username" class="fineprint"><i class="fa fa-envelope"></i> Request my username</a>
		<% } %>
	</div>
</div>

<div class="form-group local-account" id="password">
	<label class="control-label">Password</label>
	<div class="controls">
		<div class="input-group">
			<input type="password" class="form-control" maxlength="200">
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="This is the password that you specified when you registered with the SWAMP."></i>
			</div>
		</div>
		<% if (config['email_enabled']) { %>
		<a id="reset-password" class="fineprint"><i class="fa fa-repeat"></i> Reset my password</a>
		<% } %>
	</div>
</div>

<div id="linked-account-sign-in"></div>
