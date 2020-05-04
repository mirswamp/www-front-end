<div id="project-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Name</label>
		<div class="controls"><%- full_name %></div>
	</div>

	<div class="form-group" style="display:none">
		<label class="form-label">Project type</label>
		<div class="controls"><%- projectType %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Owner</label>
		<div class="controls">
		<% if (ownerName) { %>

		<% if (application.config.email_enabled) { %>
			<a href="mailto:<%- ownerEmail %>">
				<%- ownerName %>
			</a>
		<% } else { %>
			<%- ownerName %>
		<% } %>

		<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Number of members</label>
		<div class="controls" id="number-of-members"></div>
	</div>

	<div class="form-group">
		<label class="form-label">Use public tools</label>
		<div class="controls" id="tools">
			<% if (exclude_public_tools_flag) { %>
			no
			<% } else { %>
			yes
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls">
			<%= datetimeToHTML(create_date) %>
		</div>
	</div>

	<% if (typeof update_date !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls">
			<%= datetimeToHTML(update_date) %>
		</div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description %></div>
	</div>
</div>
