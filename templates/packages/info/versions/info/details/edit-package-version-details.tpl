<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit <span class="name"><%= package_name %> <%- version_string %></span> Package Version Details</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#packages"><i class="fa fa-gift"></i>Packages</a></li>
	<li><a href="<%= package_url %>"><i class="fa fa-gift"></i><%- package_name %></a></li>
	<li><a href="<%= package_version_url %>"><i class="fa fa-gift"></i>Package Version <%- version_string %></a></li>
	<li><i class="fa fa-pencil"></i>Edit Details</li>
</ol>

<div id="package-version-profile-form"></div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Details</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>