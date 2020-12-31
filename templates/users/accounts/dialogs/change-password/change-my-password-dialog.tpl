<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-keyboard-o"></i>
		Change My Password
	</h1>
</div>

<div class="modal-body">
	<form action="/" class="form-horizontal">
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>

		<div class="form-group">
			<label class="required control-label">Current password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" id="current-password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Current password" data-content="Your current password that you would like to change."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">New password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" name="password" id="new-password" maxlength="200" />
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
		
		<div class="form-group">
			<label class="required control-label">Confirm new password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="form-control" autocomplete="off" name="confirm-password" id="confirm-password" maxlength="200" />
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
</div>

<div class="modal-footer">
	<button id="submit" class="btn btn-primary"><i class="fa fa-envelope"></i>Submit</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
</div>
