<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-comment"></i>
		Request <%= permission? permission.get('title') : '' %>
	</h1>
</div>

<div class="modal-body">

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Error: </label><span class="message">You must first read the policy and check the "I accept" box below to proceed.</span>
	</div>

	<div id="permission-comment-form" class="vertically scrollable" style="max-height:300px">
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"<% if (permission.has('policy')) { %> disabled<% } %>><i class="fa fa-check"></i>OK</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>
