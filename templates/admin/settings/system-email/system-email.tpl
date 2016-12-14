<h2>Recipients</h2>
<p>The following users are registered system email users:</p>
<div id="system-email-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading system email users...</div>
</div>

<h2>Content</h2>
<form action="/" class="form-horizontal">
	<div class="form-group">
		<label class="form-label">Subject</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" id="email-subject">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Subject" data-content="This is the subject of your system wide email."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Body</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="form-control" id="email-body" rows="10"></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Body" data-content="This is the body of your system wide email."></i>
				</div>
			</div>
		</div>
	</div>
</form>

<div class="bottom buttons">
	<button id="send-email" class="btn btn-primary btn-lg"><i class="fa fa-envelope"></i>Send Email</button>
</div>

