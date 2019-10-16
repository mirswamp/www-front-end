<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<div class="new-password form-group">
	<label class="required control-label">New password</label>
	<div class="controls">
		<div class="input-group">
			<input type="password" class="required form-control" autocomplete="off" name="password" maxlength="200" />
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="New password" data-content="<%= passwordPolicy %>"></i>
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

<div class="confirm-password form-group">
	<label class="required control-label">Confirm new password</label>
	<div class="controls">
		<div class="input-group">
			<input type="password" class="form-control" autocomplete="off" name="confirm-password" maxlength="200" />
			<div class="input-group-addon">
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm new password" data-content="Please retype your password exactly as you first entered it."></i>
			</div>
		</div>
	</div>
</div>

<div align="right">
	<label><span class="required"></span>Fields are required</label>
</div>