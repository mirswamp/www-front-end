<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit <span class="name"><%- package.get('name') %> <%- version_string %></span> Package Version Build Info</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#packages"><i class="fa fa-gift"></i>Packages</a></li>
	<li><a href="#packages/<%- package.get('package_uuid') %>"><i class="fa fa-gift"></i><%- package.get('name') %></a></li>
	<li><a href="#packages/versions/<%- model.get('package_version_uuid') %>"><i class="fa fa-gift"></i>Package Version <%- version_string %></a></li>
	<li><i class="fa fa-pencil"></i>Edit Build Info</li>
</ol>

<div id="build-info">
	<div class="alert alert-info" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<strong>Notice: &nbsp;</strong><span class="message"></span>
	</div>
	
	<p>The following parameters are used to configure the build script which is used to build the package. </p>
	<br />
	<div id="build-profile-form"></div>
	
	<div class="form-group">
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

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
	</div>
</div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Build Info</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
