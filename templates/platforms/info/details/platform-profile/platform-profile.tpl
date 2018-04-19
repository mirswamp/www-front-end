<div id="platform-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Platform name</label>
		<div class="controls"><%- name %></div>
	</div>

	<% if (model.hasCreateDate()) { %>
	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= datetimeToHTML(model.getCreateDate()) %></div>
	</div>
	<% } %>

	<% if (model.hasUpdateDate()) { %>
	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls"><%= datetimeToHTML(model.getUpdateDate()) %></div>
	</div>
	<% } %>

	<% if (typeof description !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description %></div>
	</div>
	<% } %>
</div>
