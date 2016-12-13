<div id="project-profile" class="form-horizontal">

	<fieldset>
		<legend>Assessment</legend>

		<div class="form-group package">
			<label class="form-label">Package</label>
			<div class="controls">
				<span class="name"><%- model.get('package').name %></span>
				<span class="version"><%- model.get('package').version_string %></span>
			</div>
		</div>

		<div class="form-group tool">
			<label class="form-label">Tool</label>
			<div class="controls">
				<span class="name"><%- model.get('tool').name %></span>
				<span class="version"><%- model.get('tool').version_string %></span>
			</div>
		</div>

		<div class="form-group platform">
			<label class="form-label">Platform</label>
			<div class="controls">
				<span class="name"><%- model.get('platform').name %></span>
				<span class="version"><%- model.get('platform').version_string %></span>
			</div>
		</div>

		<div class="form-group status">
			<label class="form-label">Status</label>
			<div class="controls">
				<%- status %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>UUIDs</legend>

		<div class="form-group">
			<label class="form-label">Execution record UUID</label>
			<div class="controls">
				<%- model.get('execution_record_uuid') %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Assessment run UUID</label>
			<div class="controls">
				<%- model.get('assessment_run_uuid') %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Assessment result UUID</label>
			<div class="controls">
				<%- model.get('assessment_result_uuid') %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Dates</legend>

		<div class="form-group">
			<label class="form-label">Create date</label>
			<div class="controls">
				<% if (model.has('create_date')) { %>
				<%= dateToDetailedHTML(model.get('create_date')) %>
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Run date</label>
			<div class="controls">
				<% if (model.has('run_date')) { %>
				<%= dateToDetailedHTML(model.get('run_date')) %>
				<% } else { %>
				has not run
				<% } %>
			</div>
		</div>

		<div class="form-group">
			<label class="form-label">Completion date</label>
			<div class="controls">
				<% if (model.has('completion_date')) { %>
				<%= dateToDetailedHTML(model.get('completion_date')) %>
				<% } else { %>
				not completed
				<% } %>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Statistics</legend>

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
