<div id="package-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Tool name</label>
		<div class="controls"><%- name %></div>
	</div>

	<% if (0) { %>
	<div class="form-group">
		<label class="form-label">Is build needed</label>
		<% if (typeof is_build_needed !== 'undefined') { %>
		<% if (is_build_needed) { %>
		yes
		<% } else { %>
		no
		<% } %>
		<% } else { %>
		unknown
		<% } %>
		<br />
	</div>
	<% } %>

	<% if (typeof package_type_names !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Package types supported</label>
		<div class="controls">
			<ul>
			<% for (var i = 0; i < package_type_names.length; i++) { %>
				<li><%- package_type_names[i] %></li>
			<% } %>
			</ul>
		</div>
	</div>
	<% } %>

	<% if (typeof platform_names !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Platforms supported</label>
		<div class="controls">
			<ul>
			<% for (var i = 0; i < platform_names.length; i++) { %>
				<li><%- platform_names[i] %></li>
			<% } %>
			</ul>
		</div>
	</div>
	<% } %>

	<% if (typeof viewer_names !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Viewers supported</label>
		<div class="controls">
			<ul>
			<% for (var i = 0; i < viewer_names.length; i++) { %>
				<li><%- viewer_names[i] %></li>
			<% } %>
			</ul>
		</div>
	</div>
	<% } %>

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
		<div class="controls"><%= description %></div>
	</div>
	<% } %>
</div>
