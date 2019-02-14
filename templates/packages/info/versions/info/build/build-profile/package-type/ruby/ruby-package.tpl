<div id="ruby-package-info" class="form-horizontal">
	<fieldset>
		<legend>Ruby build info</legend>

		<div class="form-group">
			<label class="form-label">Build system</label>
			<div class="controls"><%- build_system %></div>
		</div>

		<% if (build_system == 'other') { %>
		<div class="form-group">
			<label class="form-label">Build command</label>
			<div class="controls"><%- build_cmd %></div>
		</div>
		<% } %>

		<br />
		<div class="form-group">
			<% var showConfigure = config_dir || config_cmd || config_opt; %>
			<% var showBuild = build_dir || build_file || build_opt || build_target || !build_system || build_system == 'no-build' || build_system == 'none' || exclude_paths; %>
			<% var showAdvanced = showConfigure || showBuild || exclude_paths; %>

			<div id="advanced-settings" class="panel"<% if (build_system == 'no-build' || build_system == 'ruby-gem') { %>style="display:none" <% } %> >
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
					</div>

					<div class="nested">
						<% if (showAdvanced) { %>

						<% if (showConfigure) { %>
						<div id="configure-settings" class="well">
							<h3><i class="fa fa-tasks"></i>Configure settings</h3>

							<% if (config_dir) { %>
							<div class="form-group">
								<label class="form-label">Configure path</label>
								<div class="controls"><%- config_dir %></div>
							</div>
							<% } %>

							<% if (config_cmd) { %>
							<div class="form-group">
								<label class="form-label">Configure command</label>
								<div class="controls"><%- config_cmd %></div>
							</div>
							<% } %>

							<% if (config_opt) { %>
							<div class="form-group">
								<label class="form-label">Configure options</label>
								<div class="controls"><%- config_opt %></div>
							</div>
							<% } %>
						</div>
						<% } %>

						<% if (showBuild) { %>
						<div id="build-settings" class="well">
							<h3><i class="fa fa-puzzle-piece"></i>Build settings</h3>

							<% if (build_dir) { %>
							<div class="form-group">
								<label class="form-label">Build path</label>
								<div class="controls"><%- build_dir %></div>
							</div>
							<% } %>

							<% if (build_file) { %>
							<div class="form-group">
								<label class="form-label">Build file</label>
								<div class="controls"><%- build_file %></div>
							</div>
							<% } %>

							<% if (build_opt) { %>
							<div class="form-group">
								<label class="form-label">Build options</label>
								<div class="controls"><%- build_opt %></div>
							</div>
							<% } %>

							<% if (build_target) { %>
							<div class="form-group">
								<label class="form-label">Build target</label>
								<div class="controls"><%- build_target %></div>
							</div>
							<% } %>
						</div>
						<% } %>

						<% if (exclude_paths) { %>
						<div class="form-group">
							<label class="form-label">Exclude paths</label>
							<div class="controls"><%- exclude_paths %></div>
						</div>
						<% } %>

						<% } else { %>
						<p>No advanced settings have been defined. </p>
						<% } %>
					</div>
				</div>
			</div>
		</div>

	</fieldset>
</div>