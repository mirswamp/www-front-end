<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		Add Sign In
	</h1>
</div>

<div class="modal-body">
	<p>If you already have an account with one of the identity providers listed below, then you can add the ability to sign in using your credentials from one of these providers. </p>

	<form class="form-horizontal">
		<div class="linked-account form-group">
			<label class="control-label">Add Sign In With</label>
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
	</form>
</div>

<div class="modal-footer">
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>