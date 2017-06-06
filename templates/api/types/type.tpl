<h1><div class="icon"><i class="fa fa-compass"></i></div>
<span class="type"><%= name %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#help"><i class="fa fa-question"></i>Help</a></li>
	<li><a href="#api"><i class="fa fa-compass"></i>API Explorer</a></li>
	<li><a href="#api"><i class="fa fa-code"></i>Types</a></li>
	<li><span class="type"><%= name %></span></li>
</ol>

<div class="well">
	No description is available for this type.
</div>

<h2>Fields</h2>
<div id="fields-list"></div>

<div class="bottom buttons">
	<button id="back" class="btn btn-lg"><i class="fa fa-arrow-left"></i>Back</button>
	
	<% if (editable) { %>
	<button id="edit" class="btn btn-lg"><i class="fa fa-pencil"></i>Edit Type</button>
	<button id="delete" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Type</button>
	<% } %>
</div>

