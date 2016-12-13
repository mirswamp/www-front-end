<div class="well">
	<div id="tool-profile"></div>
</div>

<h2>Versions</h2>
<p>The following versions of this software tool are available: </p>

<div id="tool-versions-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading tool versions...</div>
</div>

<div class="bottom buttons">
	<% if (isOwned) { %>
	<button id="edit-tool" class="btn btn-lg"><i class="fa fa-pencil"></i>Edit Tool</button>
	<button id="delete-tool" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Tool</button>
	<% } %>
	<% if (showPolicy) { %>
	<button id="show-policy" class="btn btn-lg"><i class="fa fa-gavel"></i>Show Policy</button>
	<% } %>
</div>
