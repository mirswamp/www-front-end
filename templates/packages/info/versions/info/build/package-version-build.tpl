<div id="build-info">
	<div id="build-profile"></div>
</div>

<div class="bottom buttons">
	<% if (package.isOwned()) { %>
	<button id="edit" class="btn btn-primary btn-lg"><i class="fa fa-pencil"></i>Edit Build Info</button>
	<% } %>
	<% if (show_source_files) { %>
	<button id="show-source-files" class="btn btn-lg"><i class="fa fa-file"></i>Show Source Files</button>
	<% } %>
	<% if (show_build_script) { %>
	<button id="show-build-script" class="btn btn-lg"><i class="fa fa-code"></i>Show Build Script</button>
	<% } %>
	<% if (show_navigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<button id="prev" class="btn btn-lg" style="display:none"><i class="fa fa-arrow-left"></i>Prev</button>
	<% if (package.isOwned()) { %>
	<button id="next" class="btn btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } else { %>
	<button id="start" class="btn btn-lg"><i class="fa fa-fast-backward"></i>Start</button>
	<% } %>
	<% } %>
</div>
