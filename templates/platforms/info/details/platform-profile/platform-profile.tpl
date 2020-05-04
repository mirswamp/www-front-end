<div id="platform-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Platform name</label>
		<div class="controls"><%- name %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= datetimeToHTML(create_date) %></div>
	</div>

	<% if (typeof update_date !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls"><%= datetimeToHTML(update_date) %></div>
	</div>
	<% } %>

	<% if (typeof description !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description %></div>
	</div>
	<% } %>
</div>
