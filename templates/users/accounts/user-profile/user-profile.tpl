<form class="form-horizontal">
	<fieldset>
		<legend>Personal info</legend>

		<div class="form-group">
			<label class="form-label">First name</label>
			<div class="controls">
				<%- first_name %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Last name</label>
			<div class="controls">
				<%- last_name %>
			</div>
		</div>

		<% if (affiliation) { %>
		<div class="form-group">
			<label class="form-label">Affiliation</label>
			<div class="controls">
				<%- affiliation %>
			</div>
		</div>
		<% } %>

		<% if (showUserType) { %>
		<% if (user_type) { %>
		<div class="form-group">
			<label class="form-label">User type</label>
			<div class="controls">
				<%- user_type %>
			</div>
		</div>
		<% } %>
		<% } %>
	</fieldset>

	<fieldset>
		<legend>Account info</legend>	

		<div class="form-group">
			<label class="form-label">Username</label>
			<div class="controls">
				<%- username %>
			</div>
		</div>
		
		<% if (application.config.email_enabled) { %>
		<div class="form-group">
			<label class="form-label">Email address</label>
			<div class="controls">
				<a href="mailto:<%- email %>"><%= email %></a>
			</div>
		</div>
		<% } %>

	</fieldset>

	<fieldset>
		<legend>Dates</legend>

		<div class="form-group">
			<label class="form-label">Creation date</label>
			<div class="controls">
				<%= datetimeToHTML(create_date) %>
			</div>
		</div>

		<% if (typeof update_date !== 'undefined') { %>
		<div class="form-group">
			<label class="form-label">Last modified date</label>
			<div class="controls">
				<%= datetimeToHTML(update_date) %>
			</div>
		</div>

		<% if (typeof penultimate_login_date !== 'undefined') { %>
		<div class="form-group">
			<label class="form-label">Previous sign in date</label>
			<div class="controls">
				<%= datetimeToHTML(penultimate_login_date) %>
			</div>
		</div>
		<% } %>

		<% } %>
	</fieldset>

	<% if (typeof ultimate_login_date !== 'undefined' || typeof penultimate_login_date !== 'undefined') { %>
	<fieldset>
		<legend>Times</legend>

		<% if (typeof ultimate_login_date !== undefined) { %>
		<div class="form-group">
			<label class="form-label">Time since current sign in</label>
			<div class="controls">
				<span id="time-since-login"><%= elapsedTimeToHTML(UTCDateToLocalDate(ultimate_login_date), new Date()) %></span>
			</div>
		</div>
		<% } %>

		<% if (typeof penultimate_login_date !== 'undefined') { %>
		<div class="form-group">
			<label class="form-label">Time since previous sign in</label>
			<div class="controls">
				<span id="time-since-previous-login"><%= elapsedTimeToHTML(UTCDateToLocalDate(penultimate_login_date), new Date()) %></span>
			</div>
		</div>
		<% } %>

	</fieldset>
	<% } %>
</form>

<div class="bottom buttons">
	<% if (!application.config.ldap_readonly) { %>
	<button id="edit" class="btn btn-primary btn-lg"<% if (application.config.ldap_readonly) { %> disabled<% } %>><i class="fa fa-pencil"></i>Edit Profile</button>
	<button id="change-password" class="btn btn-lg"<% if (application.config.ldap_readonly) { %> disabled<% } %>><i class="fa fa-keyboard-o"></i>Change Password</button>
	<% if (application.config.email_enabled) { %>
	<button id="reset-password" class="btn btn-lg"<% if (application.config.ldap_readonly) { %> disabled<% } %>><i class="fa fa-refresh"></i>Reset Password</button>
	<% } %>
	<button id="delete-account" class="btn btn-lg"><i class="fa fa-trash"></i>Disable Account</button>
	<% } %>
</div>

