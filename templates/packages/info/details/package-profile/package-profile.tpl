<div id="package-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Name</label>
		<div class="controls"><%- name %></div>
	</div>

	<% if (package_type) { %>
	<div class="form-group">
		<label class="form-label">Language</label>
		<div class="controls"><%- package_type %></div>
	</div>
	<% } %>

	<% if (model.hasCreateDate()) { %>
	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= dateToHTML(model.getCreateDate()) %></div>
	</div>
	<% } %>

	<% if (model.hasUpdateDate()) { %>
	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls"><%= dateToHTML(model.getUpdateDate()) %></div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">External URL</label>
		<div class="controls"><%- external_url? external_url : 'none' %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description? description : 'none' %></div>
	</div>
</div>
