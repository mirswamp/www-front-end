<form action="/" class="form-horizontal">
	<fieldset>
		<legend>Personal info</legend>

		<div class="form-group">
			<label class="required control-label">First name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="first-name" id="first-name" value="<%- first_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="First name" data-content="This is the informal name or given name that you are called by."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Last name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="last-name" id="last-name" value="<%- last_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Last name" data-content="This is your family name or surname."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Affiliation</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="affiliation" id="affiliation" value="<%- affiliation %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Affiliation" data-content="The company, university, or other organization that you are affiliated with."></i>
					</div>
				</div>
			</div>
		</div>

		<% if (showUserType) { %>
		<div class="form-group">
			<label class="control-label">User type</label>
			<div class="controls">
				<select id="user-type-selector">
					<option value="none"></option>
					<option <% if (user_type == 'individual') { %> selected <% } %>value="individual">Individual</option>
					<option <% if (user_type == 'educational') { %> selected <% } %>value="educational">Educational</option>
					<option <% if (user_type == 'government') { %> selected <% } %>value="government">Government</option>
					<option <% if (user_type == 'commercial') { %> selected <% } %>value="commercial">Commercial</option>
					<option <% if (user_type == 'open-source') { %> selected <% } %>value="open-source">Open Source</option>
					<option <% if (user_type == 'test') { %> selected <% } %>value="test">Test</option>
				</select>
			</div>
		</div>
		<% } %>
	</fieldset>

	<fieldset>
		<legend>Account info</legend>

		<div class="form-group">
			<label class="required control-label">Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="username" id="username" value="<%- username %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="Your username is the name that you use to sign in to the web site."></i>
					</div>
				</div>
			</div>	
		</div>
		
		<% if (application.config.email_enabled) { %>
		<div class="form-group">
			<label class="required control-label">Email address</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required email form-control" name="email" id="email" value="<%- email %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="A valid email address is required and will be used for your account registration and for password recovery."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Confirm email address</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required confirm-email form-control" name="confirm-email" id="confirm-email" value="<%- email %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm email address" data-content="Please retype your previously entered email address for verification."></i>
					</div>
				</div>
			</div>
		</div>
		<% } %>
	</fieldset>
	
	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
