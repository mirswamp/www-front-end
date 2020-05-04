<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-check"></i>
		Confirm Run Request
	</h1>
</div>

<div class="modal-body">
	<i class="alert-icon fa fa-3x fa-question-circle" style="float:left; margin-left:10px; margin-right:20px"></i>
	<p>Please confirm that you would like to run these assessments now.</p>

	<% if (application.config.email_enabled) { %>
	<br />
	<form>
		<div class="checkbox well">
			<label>
				<input type="checkbox" name="notify" id="notify" />
				Notify me via email when these assessment runs are completed.
			</label>
		</div>
	</form>
	<% } %>
</div>

<div class="modal-footer">
	<button id="run-now" class="btn btn-primary" type="button" data-dismiss="modal"><i class="fa fa-play"></i>Run Now</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>