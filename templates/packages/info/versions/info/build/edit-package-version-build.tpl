<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit <span class="name"><%- package_name %> <%- version_string %></span> Package Version Build Info</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#packages"><i class="fa fa-gift"></i>Packages</a></li>
	<li><a href="<%= package_url %>"><i class="fa fa-gift"></i><%= package_name %></a></li>
	<li><a href="<%= package_version_url %>"><i class="fa fa-gift"></i>Package Version <%- version_string %></a></li>
	<li><i class="fa fa-pencil"></i>Edit Build Info</li>
</ol>

<div id="build-info">
	<div class="alert alert-info" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<strong>Notice: &nbsp;</strong><span class="message"></span>
	</div>
	
	<div id="build-profile-form"></div>
	
	<div class="form-group" style="display:none">
		<div class="panel" id="build-script-accordion" <% if (!build_system || build_system == "no-build" || build_system == "none") { %>style="display:none"<% } %> >
			<div class="panel-group">
				<div class="panel-heading">
					<label>
					<a class="accordion-toggle" data-toggle="collapse" data-parent="#build-script-accordion" href="#build-script-info">
						<i class="fa fa-minus-circle" />
						Build script
					</a>
					</label>
				</div>
				<div id="build-script-info" class="nested accordion-body collapse in">
					<div id="build-script"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Build Info</button>
	<% if (show_source_files) { %>
	<button id="show-source-files" class="btn btn-lg"><i class="fa fa-file"></i>Show Source Files</button>
	<% } %>
	<% if (show_build_script) { %>
	<button id="show-build-script" class="btn btn-lg"><i class="fa fa-code"></i>Show Build Script</button>
	<% } %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
