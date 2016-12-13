<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-wrench"></i>
		<%= permission.get('title') %> Info
	</h1>
</div>

<div class="modal-body">
	<p>Before we can grant you permission use this tool, please tell us a bit about yourself and the intended usage of this tool.</p>

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
	</div>
	
	<div id="tool-permission-form" class="vertically scrollable" style="max-height:300px"></div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" disabled><i class="fa fa-check" disabled></i>OK</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>
