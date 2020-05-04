<div class="well">
	<div id="package-profile"></div>
</div>

<h2>Versions</h2>
<% if (isOwned) { %>
<div class="top buttons">
	<button id="add-new-version" class="btn"><i class="fa fa-plus"></i>Add New Version</button>
</div>
<% } %>

<p>The following versions of this software package are available:</p>
<div style="clear:both"></div>

<div id="package-versions-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading package versions...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<% if (isOwned || isPublic) { %>
	<button id="run-new-assessment" class="btn btn-primary btn-lg"><i class="fa fa-play"></i>Run New Assessment</button>
	<% } %>
	<% if (isOwned) { %>
	<button id="delete-package" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Package</button>
	<% } %>
</div>