<form action="/" class="form-horizontal">
	<h1>Reset Password</h1>

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Error: </label><span class="message">Please try again.</span>
	</div>

	<p>Please enter and confirm your new password:</p>
	<br />

	<div class="form-group">
		<label class="required control-label">New password</label>
		<div class="controls">
			<div class="input-group">
				<input type="password" class="required form-control" autocomplete="off" name="password" id="password" maxlength="200">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="New password" data-content="<%= passwordPolicy %>"></i>
				</div>
			</div>
		</div>
	</div> 

	<div class="form-group">
		<label class="required control-label">Confirm new password</label>
		<div class="controls">
			<div class="input-group">
				<input type="password" class="required form-control" autocomplete="off" name="confirm-password" id="confirm-password" maxlength="200">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm new password" data-content="Please retype your password exactly as you first entered it."></i>
				</div>
			</div>
		</div>
	</div> 

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>

<div class="bottom buttons">
	<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Submit</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
