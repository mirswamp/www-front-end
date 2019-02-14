<div class="modal-header error">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-exclamation"></i>
		<% if (title) { %>
		<%- title %>
		<% } else { %>
		Error
		<% } %>
	</h1>
</div>

<div class="modal-body">
	<i class="error-icon fa fa-3x fa-exclamation-circle" style="float:left; margin-left:10px; margin-right:20px"></i>
	<p class="vertically scrollable" style="max-height:250px"><%= message %></p>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>