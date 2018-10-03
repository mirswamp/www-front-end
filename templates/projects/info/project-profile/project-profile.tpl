<div id="project-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Name</label>
		<div class="controls"><%- full_name %></div>
	</div>

	<div class="form-group" style="display:none">
		<label class="form-label">Project type</label>
		<div class="controls"><%- model.getProjectTypeStr() %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Owner</label>
		<div class="controls">
		<% if (model && model.has('owner')) { %>

		<% if (config['email_enabled']) { %>
			<a href="mailto:<%- model.get('owner').get('email') %>">
				<%- model.get('owner').getFullName() %>
			</a>
		<% } else { %>
			<%- model.get('owner').getFullName() %>
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
			<% if (model.hasCreateDate()) { %>
			<%= datetimeToHTML( model.getCreateDate() ) %>
			<% } %>
		</div>
	</div>

	<% if (model.hasUpdateDate()) { %>
	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls">
			<%= datetimeToHTML( model.getUpdateDate() ) %>
		</div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description %></div>
	</div>
</div>
