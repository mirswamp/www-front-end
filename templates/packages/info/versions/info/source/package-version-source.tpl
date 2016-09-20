<div id="package-version-source-profile"></div>

<div class="bottom buttons">
	<% if (package.isOwned()) { %>
	<button id="edit" class="btn btn-primary btn-lg"><i class="fa fa-pencil"></i>Edit Source Info</button>
	<% } %>
	
	<button id="show-file-types" class="btn btn-lg"><i class="fa fa-file"></i>Show File Types</button>

	<% if (_.contains(['ruby', 'sinatra', 'rails', 'padrino'], package.getPackageType())) { %>
	<button id="show-gem-info" class="btn btn-lg"><i class="fa fa-diamond"></i>Show Gem Info</button>
	<% } %>

	<% if (model.getFilename().endsWith('.whl')) { %>
	<button id="show-wheel-info" class="btn btn-lg"><i class="fa fa-circle-o"></i>Show Wheel Info</button>
	<% } %>

	<% if (showNavigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<button id="prev" class="btn btn-lg"><i class="fa fa-arrow-left"></i>Prev</button>
	<button id="next" class="btn btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } %>
</div>
