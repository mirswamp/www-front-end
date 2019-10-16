<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-comment"></i>
		Request <%= permission? permission.get('title') : '' %>
	</h1>
</div>

<div class="modal-body">
	<div id="permission-comment-form" class="vertically scrollable" style="max-height:300px">
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"<% if (permission.has('policy')) { %> disabled<% } %>><i class="fa fa-check"></i>OK</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>