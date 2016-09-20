<h1>Link Existing SWAMP Account to GitHub</h1>

<p>Please supply your SWAMP username and password to link your SWAMP account to the following GitHub account: <b><%- username %></b></p>

<div class="form-horizontal">

	<div class="form-group">
		<label class="control-label">Username</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" id="username">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered with the SWAMP."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="control-label">Password</label>
		<div class="controls">
			<div class="input-group">
				<input type="password" class="form-control" maxlength="200" id="password">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="This is the password that you specified when you registered with the SWAMP."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
	</div>

	<div class="alert alert-info" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Notification: </label><span class="message"></span>
	</div>
</div>

<div class="bottom buttons">
	<button id="submit" class="btn btn-lg btn-primary"><i class="fa fa-plus"></i>Submit</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
