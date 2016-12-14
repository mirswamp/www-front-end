<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-terminal"></i>
		SSH Information
	</h1>
</div>

<div class="modal-body">
	<p>The virtual machine performing this assessment may be reached using an SSH client of your choosing with the following credentials:</p>

	<form action="/" class="form-horizontal">

		<div class="form-group">
			<label class="control-label">IPv4 Address</label>
			<div class="controls">
				<div class="input-group">
					<input readonly type="text" class="form-control" value="<%- info.vm_ip %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="IPv4 Address" data-content="This is the of the VM you would log in to."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">VM Username</label>
			<div class="controls">
				<div class="input-group">
					<input readonly type="text" class="form-control" value="<%- info.vm_username %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="VM Username" data-content="This is the username that you would use to log in to the VM."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">VM Password</label>
			<div class="controls">
				<div class="input-group">
					<input readonly type="text" class="form-control" value="<%- info.vm_password %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="VM Password" data-content="This is the password that you would use to log in to the VM."></i>
					</div>
				</div>
			</div>
		</div>
	</form>

	<label>Example:</label>
	<div class="well">
		ssh <%= info.vm_username %>@<%= info.vm_ip %>
	</div>
	<div class="alert alert-info">
		<label>Note: </label><span class="message">The SSH Client you use must be behind the same public facing IP address that you are currently using in this browser.</span>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button>
</div>