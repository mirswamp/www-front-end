<div id="android-source-package-info" class="form-horizontal">
	<fieldset>
		<legend>Android source build info</legend>

		<div class="form-group">
			<label class="form-label">Build system</label>
			<div class="controls"><%- build_system %></div>
		</div>

		<br />
		<div class="form-group">
			<% var showBuildSystem = maven_version || android_maven_plugin || build_system == 'android+gradle'; %>
			<% var showAndroid = android_sdk_target || android_lint_target || android_redo_build; %>
			<% var showConfigure = config_dir || config_cmd || config_opt; %>
			<% var showBuild = build_dir || build_file || build_opt || build_target; %>
			<% var showAdvanced = showBuildSystem || showAndroid || showConfigure || showBuild; %>
			
			<div class="panel" id="advanced-settings-accordion">
				<div class="panel-group">
					<div class="panel-heading">
						<label>
						<a class="accordion-toggle" data-toggle="collapse" data-parent="#advanced-settings-accordion" href="#advanced-settings">
							<i class="fa fa-minus-circle"></i>
							Advanced settings
						</a>
						</label>
					</div>
					<div id="advanced-settings" class="nested accordion-body collapse in">
						<% if (showAdvanced) { %>

						<% if (showBuildSystem) { %>
						<div id="build-system-settings" class="well">
							<h3><i class="fa fa-tasks"></i>Build system settings</h3>

							<% if (maven_version) { %>
							<div class="form-group">
								<label class="form-label">Maven version</label>
								<div class="controls">
									<% if (typeof android_sdk_target != "undefined") { %>
									<%- maven_version %>
									<% } %>
								</div>
							</div>
							<% } %>

							<% if (android_maven_plugin) { %>
							<div class="form-group">
								<label class="form-label">Maven plugin</label>
								<div class="controls">
									<% if (typeof android_maven_plugin != "undefined") { %>
									<%- android_maven_plugin %>
									<% } %>
								</div>
							</div>
							<% } %>

							<% if (build_system == 'android+gradle') { %> 
							<div class="form-group">
								<label class="form-label">Use Gradle wrapper</label>
								<div class="controls"><% if (typeof use_gradle_wrapper !== 'undefined' && use_gradle_wrapper) { %>yes<% } else { %>no<% } %></div>
							</div>
							<% } %>
						</div>
						<% } %>

						<% if (showAndroid) { %>
						<div id="android-settings" class="well">
							<h3><i class="fa fa-android"></i>Android settings</h3>

							<% if (android_sdk_target) { %>
							<div class="form-group">
								<label class="form-label">Android SDK target</label>
								<div class="controls">
									<% if (typeof android_sdk_target != "undefined") { %>
									<%- android_sdk_target %>
									<% } %>
								</div>
							</div>
							<% } %>

							<% if (android_lint_target) { %>
							<div class="form-group">
								<label class="form-label">Android lint target</label>
								<div class="controls">
									<% if (typeof android_lint_target != "undefined") { %>
									<%- android_lint_target %>
									<% } %>
								</div>
							</div>
							<% } %>

							<% if (android_redo_build) { %>
							<div class="form-group">
								<label class="form-label">Android redo build</label>
								<div class="controls">
									<%- typeof android_redo_build != "undefined" && android_redo_build == '1'?  'yes' : 'no' %>
								</div>
							</div>
							<% } %>
						</div>
						<% } %>

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

						<% } else { %>
						<p>No advanced settings have been defined. </p>
						<% } %>
					</div>
				</div>
			</div>
		</div>

	</fieldset>
</div>