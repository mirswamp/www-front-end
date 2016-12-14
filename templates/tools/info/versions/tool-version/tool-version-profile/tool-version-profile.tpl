<div id="package-version-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Version</label>
		<div class="controls"><%- version_string %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Package types supported</label>
		<div class="controls"><%- package_type_names %></div>
	</div>
		
	<% if (model.hasCreateDate()) { %>
	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= dateToHTML(model.getCreateDate()) %></div>
	</div>
	<% } %>

	<% if (model.hasUpdateDate()) { %>
	<div class="form-group" style="display:none">
		<label class="form-label">Last modified</label>
		<div class="controls"><%= dateToHTML(model.getUpdateDate()) %></div>
	</div>
	<% } %>

	<% if (typeof tool_directory !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Tool directory</label>
		<div class="controls"><%- tool_directory %></div>
	</div>
	<% } %>

	<% if (typeof tool_executable !== 'undefined') { %>
	<fieldset>
		<legend>Execution</legend>
		<div class="form-group">
			<label class="form-label">Tool executable</label>
			<div class="controls"><%- tool_executable %></div>
		</div>
		<div class="form-group">
			<label class="form-label">Tool arguments</label>
			<div class="controls"><%- tool_arguments %></div>
		</div>
	</fieldset>
	<% } %>

	<% if (typeof notes !== 'undefined') { %>
	<fieldset>
		<legend>Notes</legend>
		<div class="form-group">
			<label class="form-label">Notes</label>
			<div class="controls"><%- notes %></div>
		</div>
	</fieldset>
	<% } %>
</div>
