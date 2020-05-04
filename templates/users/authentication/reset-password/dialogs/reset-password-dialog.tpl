<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">Reset Password</h1>
</div>

<div class="modal-body">
	<p><% if (show_user) { %>Please enter your username or email address below. <% } %>After clicking the Request Reset button an email will be sent to your registered email address containing a link to reset your password.</p>
	<br />

	<% if (show_user) { %>
	<div class="form-horizontal">
		<div class="form-group">
			<label class="control-label">Username</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="text" class="form-control" id="swamp-username">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>

		<p class="separator">Or</p>

		<div class="form-group">
			<label class="control-label">Email address</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="text" class="form-control" id="email-address">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="This is the email address that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<% } %>
</div>

<div class="modal-footer">
	<button id="reset-password" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-envelope"></i>Request Reset</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
</div>