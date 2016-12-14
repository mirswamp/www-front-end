<form action="/" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Method</label>
		<div class="controls">
			<select id="method" name="method" class="select required">
				<option value="POST"<% if (method && method.toLowerCase() == 'post') { %> selected <% } %>>POST</option>
				<option value="GET"<% if (method && method.toLowerCase() == 'get') { %> selected <% } %>>GET</option>
				<option value="PUT"<% if (method && method.toLowerCase() == 'put') { %> selected <% } %>>PUT</option>
				<option value="DELETE"<% if (method && method.toLowerCase() == 'delete') { %> selected <% } %>>DELETE</option>
			</select>
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Method" data-content="This is the type of HTTP verb or method to use when making this API request."></i>
		</div>
	</div>

	<div class="form-group">
		<label class="required form-label">Route</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="route" id="route" maxlength="100" class="required" value="<%- model.get('route') %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="Please specify the URL route of this API method."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="form-control" id="description" name="description" rows="3" maxlength="200"><%- model.get('description') %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of this API route."></i>
				</div>
			</div>
		</div>
	</div>

	<% if (showCategory) { %>
	<div class="form-group">
		<label class="form-label">Category</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="category" id="category" class="required" value="<%- model.get('category') %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="This is the category that this API method belongs to."></i>
				</div>
			</div>
		</div>
	</div>
	<% } %>

	<% if (showServer) { %>
	<div class="form-group">
		<label class="form-label">Server</label>
		<div class="controls">
			<select id="server" name="server" class="select required">
				<option value="rws"<% if (server == 'rws') { %> selected <% } %>>RWS</option>
				<option value="csa"<% if (server == 'csa') { %> selected <% } %>>CSA</option>
			</select>
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Server" data-content="This is which server to use when making this API request."></i>
		</div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">Private</label>
		<div class="controls">
			<input type="checkbox" id="private" <% if (private) {%>checked<% } %>>
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Private" data-content="Whether or not this API method is visible to the public."></i>
		</div>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>

	<h2>Headers</h2>
	<div id="headers-list"></div>

	<h2>Query Parameters</h2>
	<div id="query-parameters-list"></div>

	<h2>Body Parameters</h2>
	<div id="body-parameters-list"></div>

	<h2>Responses</h2>
	<div id="responses-list"></div>
</form>
