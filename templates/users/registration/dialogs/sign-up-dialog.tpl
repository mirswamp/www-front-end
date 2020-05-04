<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-pencil"></i>Sign Up
	</h1>
</div>

<div class="modal-body">
	<p>You can create a new account by filling out a simple registration form by clicking the "Sign Up" button below.<p>

	<label style="display:block; text-align:center">Or</label>
	
	<p>If you aleady have an account with one of the identity providers listed below, then you can create a new account using your credentials from one of these providers. </p>

	<form class="form-horizontal">
		<div class="linked-account form-group">
			<label class="control-label">Sign Up With</label>
			<div class="col-sm-6 col-xs-12">
				<div class="buttons">

					<% if (show_google) { %>
					<button class="btn" type="button" id="google-sign-up" data-dismiss="modal"><i class="fa fa-google"></i>Google</button>
					<% } %>

					<% if (show_github) { %>
					<button class="btn" type="button" id="github-sign-up" data-dismiss="modal"><i class="fa fa-github"></i>GitHub</button>
					<% } %>

					<% if (show_other) { %>
					<button class="btn" type="button" id="other-sign-up" data-dismiss="modal"><i class="fa fa-users"></i>Other</button>
					<% } %>
				</div>
			</div>
		</div>
	</form>
</div>

<div class="modal-footer">
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
	<button id="sign-up" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>Sign Up</button>
</div>