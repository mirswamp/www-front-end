<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-diamond"></i>
		<% if (title) { %>
		<%- title %>
		<% } else { %>
		Package Version Gem Info
		<% } %>
	</h1>
</div>

<div class="modal-body">
	<p>The following information is from the Gemfile contained in this package version within the path '<%- packagePath %>'.</p>
	<hr />
	<div style="width:100%; height:250px; overflow:auto">
		<div id="gem-info" class="gem-info"></div>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>