<div id="build-info">
	<h2>Build Info</h2>

	<div class="alert alert-info" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<strong>Notice: &nbsp;</strong><span class="message"></span>
	</div>
	
	<div id="build-profile-form"></div>
</div>

<div class="bottom buttons">
	<% if (show_save) { %>
	<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save New Package Version</button>
	<% } else { %>
	<button id="next" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } %>
	<button id="prev" class="btn btn-lg" style="display:none"><i class="fa fa-arrow-left"></i>Prev</button>
	<% if (show_source_files) { %>
	<button id="show-source-files" class="btn btn-lg"><i class="fa fa-file"></i>Show Source Files</button>
	<% } %>
	<% if (show_build_script) { %>
	<button id="show-build-script" class="btn btn-lg"><i class="fa fa-code"></i>Show Build Script</button>
	<% } %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
