<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-circle-o"></i>
		<% if (title) { %>
		<%- title %>
		<% } else { %>
		Package Version Wheel Info
		<% } %>
	</h1>
</div>

<div class="modal-body">
	<p>The following information is from the WHEEL file contained in this package version within the path '<%- dirname %>'.</p>
	<hr />
	<div style="width:100%; height:250px; overflow:auto">
		<div id="wheel-info" class="wheel-info"></div>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>