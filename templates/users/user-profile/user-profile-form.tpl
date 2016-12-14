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

		<% if (config['email_enabled']) { %>
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
	
	<fieldset>
		<legend>Address</legend>

		<div class="form-group">
			<label class="control-label">Street Address 1</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="street-address1" id="street-address1" value="<%- model.get('address').get('street-address1') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Street address 1" data-content="The street address where you reside."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Street Address 2</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="street-address2" id="street-address2" value="<%- model.get('address').get('street-address2') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Street address 2" data-content="Additional information about your street address (building #, apartment #, etc.)"></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">City</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="city" id="city" value="<%- model.get('address').get('city') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="City" data-content="The city or village where you reside."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">State</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="state" id="state" value="<%- model.get('address').get('state') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="State" data-content="The state or province where you reside."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Postal code</label>
			<div class="controls">
				<div class="postal-code input-group">
					<input type="text" class="form-control" size="11" maxlength="11" name="postal-code" id="postal-code" value="<%- model.get('address').get('postal-code') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Postal code" data-content="The postal or 'zip' code where you reside."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Country</label>
			<div class="controls">
				<div id="country-selector"></div>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Phone</legend>

		<div class="form-group">
			<label class="control-label">Country code</label>
			<div class="controls">
				<div class="country-code input-group">
					<input type="text" class="form-control" readonly tabindex="-1" size="3" maxlength="3" name="country-code" id="country-code" value="<%- model.get('phone').get('country-code') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Country code" data-content="The country code for your phone number."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Area code</label>
			<div class="controls">
				<div class="area-code input-group">
					<input type="text" class="form-control" size="5" maxlength="5" name="area-code" id="area-code" value="<%- model.get('phone').get('area-code') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Area code" data-content="The area code for your phone number."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group">
			<label class="control-label">Phone number</label>
			<div class="controls">
				<div class="phone-number input-group">
					<input type="text" class="form-control" size="11" name="phone-number" id="phone-number" value="<%- model.get('phone').get('phone-number') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Phone number" data-content="Your phone number (optional)."></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
