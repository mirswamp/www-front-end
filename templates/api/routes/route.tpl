<h1><div class="icon"><i class="fa fa-compass"></i></div>
<span class="<%= method %> method"><%= method %></span> <span class="code route"><%= route.replace(/\//g, '<wbr>/<wbr>') %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#help"><i class="fa fa-question"></i>Help</a></li>
	<li><a href="#api"><i class="fa fa-compass"></i>API Explorer</a></li>
	<li><a href="#api"><i class="fa fa-code"></i>Routes</a></li>
	<li><span class="method"><%= method %></span> <span class="route"><%= route.replace(/\//g, '<wbr>/<wbr>') %></span></li>
</ol>


<div class="well">
	<%= description || 'No description is available for this route.' %>
</div>

<form class="form-horizontal">
	<% if (showCategory) { %>
	<div class="form-group">
		<label class="form-label">Category</label>
		<%= category %>
		<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Category" data-content="The category that this route belongs to."></i>
	</div>
	<% } %>

	<% if (showServer) { %>
	<div class="form-group">
		<label class="form-label">Server</label>
		<%= server %><%= serverHost? ' (' + serverHost.replace(/\//g, '<wbr>/<wbr>') + ')': '' %>
		<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Server" data-content="This is which server to use when making this API request."></i>
	</div>
	<% } %>

	<% if (showPrivate) { %>
	<div class="form-group">
		<label class="form-label">Private</label>
		<% if (private) { %>
			<span class="success">&#x2713;</span>
		<% } else { %>
			no
		<% } %>
		<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Private" data-content="Whether or not this API method is visible to the public."></i>
	</div>
	<% } %>
</form>

<div id="headers" style="display:none">
	<h2>Headers</h2>
	<div id="headers-list"></div>
</div>

<div id="query-parameters" style="display:none">
	<h2>Query Parameters</h2>
	<div class="parameters-list"></div>
</div>

<div id="body-parameters" style="display:none">
	<h2>Body Parameters</h2>
	<div class="parameters-list"></div>
</div>

<div id="responses" style="display:none">
	<h2>Responses</h2>
	<div id="responses-list"></div>
</div>

<div class="bottom buttons">
	<button id="try-me" class="btn btn-primary btn-lg"><i class="fa fa-play"></i>Try Me!</button>
	<button id="back" class="btn btn-lg"><i class="fa fa-arrow-left"></i>Back</button>
	
	<% if (editable) { %>
	<button id="edit" class="btn btn-lg"><i class="fa fa-pencil"></i>Edit Route</button>
	<button id="delete" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Route</button>
	<% } %>
</div>

