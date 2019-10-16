<div id="dot-net-package-info" class="form-horizontal">
	<fieldset>
		<legend>.NET build info</legend>

		<% if (solution) { %>
		<div class="form-group">
			<label class="form-label">Solution</label>
			<div class="controls"><%- solution %></div>
		</div>
		<% } %>

		<% var keys = Object.keys(projects).sort(); %>
		<% for (var i = 0; i < keys.length; i++) { %>
		<% var key = keys[i]; %>
		<% var project = projects[key]; %>

		<% if (!project['nobuild']) { %>
		<div class="well">
			<div class="form-group">
				<label class="form-label">Project</label>
				<div class="controls"><%= textToHtml(key) %></div>
			</div>

			<% if (project.configuration) { %>
			<div class="form-group">
				<label class="form-label"></label>
				<div class="controls"><label>Configuration</label><%= project.configuration %></div>
			</div>
			<% } %>

			<% if (project.framework) { %>
			<div class="form-group">
				<label class="form-label"></label>
				<div class="controls"><label>Framework</label><%= project.framework %></div>
			</div>
			<% } %>
		</div>
		<% } %>

		<% } %>
	</fieldset>
</div>