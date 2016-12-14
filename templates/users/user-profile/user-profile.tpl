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

		<% if (config['email_enabled']) { %>
		<div class="form-group">
			<label class="form-label">Email address</label>
			<div class="controls">
				<a href="mailto:<%- email %>"><%= emailToHTML(email) %></a>
			</div>
		</div>
		<% } %>
		
		<div class="form-group">
			<label class="form-label">Username</label>
			<div class="controls">
				<%- username %>
			</div>
		</div>

	</fieldset>

	<fieldset>
		<legend>Address</legend>

		<div class="form-group">
			<label class="form-label">Street address 1</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('street-address1')) { %>
				<%- model.get('address').get('street-address1') %>
				<% } %>
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Street address 2</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('street-address2')) { %>
				<%- model.get('address').get('street-address2') %>
				<% } %>
				<% } %>
			</div>
		</div>
		
		<div class="form-group">
			<label class="form-label">City</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('city')) { %>
				<%- model.get('address').get('city') %>
				<% } %>
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">State</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('state')) { %>
				<%- model.get('address').get('state') %>
				<% } %>
				<% } %>
			</div>
		</div>
		
		<div class="form-group">
			<label class="form-label">Postal code</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('postal-code')) { %>
				<%- model.get('address').get('postal-code') %>
				<% } %>
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Country</label>
			<div class="controls">
				<% if (model.has('address') && model.get('address').hasAttributes()) { %>
				<% if (model.get('address').has('country')) { %>
				<%- model.get('address').get('country') %>
				<% } %>
				<% } %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Phone</legend>

		<div class="form-group">
			<label class="form-label">Country code</label>
			<div class="controls">
				<% if (model.has('phone') && model.get('phone').hasAttributes()) { %>
				<% if (model.get('phone').has('country-code')) { %>
				<%- model.get('phone').get('country-code') %>
				<% } %>
				<% } %>
			</div>
		</div>
		
		<div class="form-group">
			<label class="form-label">Area code</label>
			<div class="controls">
				<% if (model.has('phone') && model.get('phone').hasAttributes()) { %>
				<% if (model.get('phone').has('area-code')) { %>
				(<%- model.get('phone').get('area-code') %>)
				<% } %>
				<% } %>
			</div>
		</div>
		
		<div class="form-group">
			<label class="form-label">Phone number</label>
			<div class="controls">
				<% if (model.has('phone') && model.get('phone').hasAttributes()) { %>
				<% if (model.get('phone').has('phone-number')) { %>
				<%- model.get('phone').get('phone-number') %>
				<% } %>
				<% } %>
			</div>
		</div>
	</fieldset>

	<% if (model.hasCreateDate() || model.hasUpdateDate()) { %>
	<fieldset>
		<legend>Dates</legend>

		<% if (model.hasCreateDate()) { %>
		<div class="form-group">
			<label class="form-label">Creation date</label>
			<div class="controls">
				<%= dateToHTML(model.getCreateDate()) %>
			</div>
		</div>
		<% } %>

		<% if (model.hasUpdateDate()) { %>
		<div class="form-group">
			<label class="form-label">Last modified date</label>
			<div class="controls">
				<%= dateToHTML(model.getUpdateDate()) %>
			</div>
		</div>

		<% if (model.has('penultimate_login_date')) { %>
		<div class="form-group">
			<label class="form-label">Previous sign in date</label>
			<div class="controls">
				<%= dateToHTML(model.get('penultimate_login_date')) %>
			</div>
		</div>
		<% } %>

		<% } %>
	</fieldset>
	<% } %>

	<% if (model.has('ultimate_login_date') || model.has('penultimate_login_date')) { %>
	<fieldset>
		<legend>Times</legend>

		<% if (model.has('ultimate_login_date')) { %>
		<div class="form-group">
			<label class="form-label">Time since current sign in</label>
			<div class="controls">
				<span id="time-since-login"><%= elapsedTimeToHTML(UTCDateToLocalDate(model.get('ultimate_login_date')), new Date()) %></span>
			</div>
		</div>
		<% } %>

		<% if (model.has('penultimate_login_date')) { %>
		<div class="form-group">
			<label class="form-label">Time since previous sign in</label>
			<div class="controls">
				<span id="time-since-previous-login"><%= elapsedTimeToHTML(UTCDateToLocalDate(model.get('penultimate_login_date')), new Date()) %></span>
			</div>
		</div>
		<% } %>

	</fieldset>
	<% } %>
</form>

<div class="bottom buttons">
	<button id="edit" class="btn btn-primary btn-lg"><i class="fa fa-pencil"></i>Edit Profile</button>
	<button id="change-password" class="btn btn-lg"><i class="fa fa-keyboard-o"></i>Change Password</button>
	<% if (config['email_enabled']) { %>
	<button id="reset-password" class="btn btn-lg"><i class="fa fa-refresh"></i>Reset Password</button>
	<% } %>
	<button id="delete-account" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Account</button>
</div>

