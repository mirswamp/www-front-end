<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit <span class="name"><%- package.get('name') %> <%- version_string %></span> Package Version Source Info</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#packages"><i class="fa fa-gift"></i>Packages</a></li>
	<li><a href="#packages/<%- package.get('package_uuid') %>"><i class="fa fa-gift"></i><%- package.get('name') %></a></li>
	<li><a href="#packages/versions/<%- model.get('package_version_uuid') %>"><i class="fa fa-gift"></i>Package Version <%- version_string %></a></li>
	<li><i class="fa fa-pencil"></i>Edit Source</li>
</ol>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<div id="package-version-source-profile-form"></div>
<br />
<br />

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Source Info</button>
	<button id="show-file-types" class="btn btn-lg"><i class="fa fa-file"></i>Show File Types</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
