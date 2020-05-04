<div id="project-profile" class="form-horizontal">

	<fieldset>
		<legend>Assessment</legend>

		<div class="form-group package">
			<label class="form-label">Package</label>
			<div class="controls">
				<span class="name"><%- package.name %></span>
				<span class="version"><%- package.version_string %></span>
			</div>
		</div>

		<div class="form-group tool">
			<label class="form-label">Tool</label>
			<div class="controls">
				<span class="name"><%- tool.name %></span>
				<span class="version"><%- tool.version_string %></span>
			</div>
		</div>

		<div class="form-group platform">
			<label class="form-label">Platform</label>
			<div class="controls">
				<span class="name"><%- platform.name %></span>
				<span class="version"><%- platform.version_string %></span>
			</div>
		</div>

		<div class="form-group status">
			<label class="form-label">Status</label>
			<div class="controls">
				<%= status %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>UUIDs</legend>

		<div class="form-group">
			<label class="form-label">Execution record UUID</label>
			<div class="controls">
				<%= execution_record_uuid %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Assessment run UUID</label>
			<div class="controls">
				<%= assessment_run_uuid %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Assessment result UUID</label>
			<div class="controls">
				<%= assessment_result_uuid %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Dates</legend>

		<div class="form-group">
			<label class="form-label">Create date</label>
			<div class="controls">
				<%= datetimeToHTML(create_date) %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Run date</label>
			<div class="controls">
				<% if (typeof run_date !== 'undefined') { %>
				<%= datetimeToHTML(run_date) %>
				<% } else { %>
				has not run
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Completion date</label>
			<div class="controls">
				<% if (typeof completion_date !== 'undefined') { %>
				<%= datetimeToHTML(completion_date) %>
				<% } else { %>
				not completed
				<% } %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Statistics</legend>

		<div class="form-group">
			<label class="form-label">Execution node</label>
			<div class="controls">
				<% if (typeof execute_node_architecture_id !== 'undefined' && execute_node_architecture_id != null) { %>
				<%- execute_node_architecture_id %>
				<% } else { %>
				unknown
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Execution duration</label>
			<div class="controls">
				<% if (typeof execution_duration !== 'undefined' && execution_duration != null) { %>
				<%- execution_duration %>
				<% } else { %>
				unknown
				<% } %>
			</div>
		</div>
	</fieldset>
</div>
