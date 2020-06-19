<h2>Recipients</h2>
<p>The following users are registered system email users:</p>

<label>
	<input type="checkbox" id="show-inactive-accounts"<% if (showInactiveAccounts) { %> checked="checked"<% } %>>
	Show inactive accounts
</label>

<div id="system-email-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading system email users...</div>
	</div>
</div>

<div class="nav-button-bar"></div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<h2>Content</h2>
<div id="system-email-form"></div>

<div class="bottom buttons">
	<button id="send-email" class="btn btn-lg"><i class="fa fa-envelope"></i>Send Email</button>
</div>

