<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-file"></i>
		<%= title %>
	</h1>
</div>

<div class="modal-body">
	<div style="max-height:300px; overflow:auto">
		<% if (source_files.length > 0) { %>
		<% for (var i = 0; i < source_files.length; i++) { %>
		<%= source_files[i] %> <br/>
		<% } %>
		<% } else { %>
		No source files found.
		<% } %>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>