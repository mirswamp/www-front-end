<div class="well">
	<div id="package-version-profile"></div>
</div>

<div class="bottom buttons">
	<% if (isOwned || isPublic) { %>
	<button id="run-new-assessment" class="btn btn-primary btn-lg"><i class="fa fa-play"></i>Run New Assessment</button>
	<button id="download-version" class="btn btn-lg"><i class="fa fa-download"></i>Download Version</button>
	<% } %>
	<% if (isOwned) { %>
	<button id="delete-version" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Version</button>
	<% } %>

	<% if (showNavigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<button id="next" class="btn btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } %>
</div>
