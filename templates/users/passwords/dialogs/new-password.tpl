<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-key"></i>New <%= label %> Password
	</h1>
</div>

<div class="modal-body">
	<p>Your new password is:</p>

	<div class="well"><span id="password"><%= password %></span></div>

	<p>Please store this password is a safe place since it can not be retrieved once this dialog box is dismissed.</p>
</div>

<div class="modal-footer">
	<button id="copy-to-clipboard" class="btn" data-clipboard-target="#password"><i class="fa fa-copy"></i>Copy to Clipboard</button>
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button>
</div>