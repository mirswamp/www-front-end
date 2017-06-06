<form action="/" class="form-horizontal" autocomplete="off">
	<br />

	<fieldset>
		<legend>Personal info</legend>

		<div class="form-group">
			<label class="required control-label">First name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="first-name" id="first-name" class="required" value="<%- first_name %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="First name" data-content="This is the informal name that you are called by."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Last name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="last-name" id="last-name" class="required" value="<%- last_name %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Last name" data-content="This is your family name or surname."></i>
					</div>
				</div>
			</div>
		</div>
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

		<div class="form-group">
			<label class="required control-label">Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="form-control" autocomplete="off" name="password" id="password" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="Passwords must be at least 10 characters long and include at least three of the following character types: uppercase, lowercase, number, or symbol. Common and simple passwords will be rejected. Maximum length is 200 characters (additional characters will be truncated). Characters outside of the ASCII range of 32 to 126 are not allowed."></i>
					</div>
				</div>
				<div class="password-meter" style="display:none">
					<label class="password-meter-message"></label>
					<div class="password-meter-bg">
						<div class="password-meter-bar"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Confirm password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" name="confirm-password" id="confirm-password" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm password" data-content="Please retype your password exactly as you first entered it."></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>

	<% if (config['use_promo_code']) { %>
	<fieldset>
		<legend>Promotional info</legend>

		<div class="form-group">
			<label class="control-label">Promotional code</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" autocomplete="off" name="promo-code" id="promo-code" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Promotional code" data-content="You may enter a promotional code to receive accelerated access to features and the freedom to use an email address from any domain."></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
	<% } %>
	
	<% if (config['email_enabled']) { %>
	<fieldset>
		<legend>Contact info</legend>

		<div class="form-group">
			<label class="required control-label">Email address</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required email form-control" name="email" id="email" value="<%- email %>">
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
					<input type="text" class="required confirm-email form-control" name="confirm-email" id="confirm-email" value="<%- email %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm email address" data-content="Please retype your previously entered email address for verification.  You may use any address if you supply a SWAMP Promotional Code."></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
	<% } %>
	
	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>


