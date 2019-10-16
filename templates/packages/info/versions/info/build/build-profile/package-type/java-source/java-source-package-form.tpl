<p>The following parameters are used to configure the build script which is used to build this Java package. </p>
<br />

<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Java source build info</legend>

		<div id="build-system" class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select name="build-system" data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the system used to build the package (i.e. 'ant' etc)." >
					<option disabled></option>
					<option <% if (!build_system || build_system == 'no-build') { %> selected <% } %> 
						value="no-build">No build</option>
					<option <% if (build_system == 'ant') { %> selected <% } %>
						value="ant">Ant</option>
					<option <% if (build_system == 'ant+ivy') { %> selected <% } %>
						value="ivy">Ant+Ivy</option>
					<option <% if (build_system == 'maven') { %> selected <% } %>
						value="maven">Maven</option>
					<option <% if (build_system == 'gradle' || build_system == 'gradle-wrapper') { %> selected <% } %>
						value="gradle">Gradle</option>
				</select>
			</div>
		</div>

		<div class="form-group">
			<div id="advanced-settings" class="panel">
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
					</div>

					<div class="nested">
						<div id="build-system-settings" class="well">
							<h3><i class="fa fa-tasks"></i>Build system settings</h3>

							<div id="use-gradle-wrapper" class="gradle-settings form-group">
								<label class="control-label">Use Gradle wrapper</label>
								<div class="controls">
									<input type="checkbox" <% if (typeof use_gradle_wrapper !== 'undefined' && use_gradle_wrapper || build_system == 'gradle-wrapper') { %>checked<% } %>>
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Use Gradle wrapper" data-content="The gradle wrapper is a standard way of making a gradle package use a specific version of gradle, which it may require. Some packages will work with any gradle, some only with the gradle wrapper mechanism. Check the documentation"></i>
								</div>
							</div>
						</div>

						<div id="configure-settings" class="well">
							<h3><i class="fa fa-tasks"></i>Configure settings</h3>

							<div id="configure-path" class="form-group">
								<label class="control-label">Configure path</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="1000" value="<%- config_dir %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure path" data-content="The optional path to run the configure command from, relative to the package path. If no path is provided, '.' is assumed."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="select-configure-path" class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div id="configure-command" class="form-group">
								<label class="control-label">Configure command</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="4000" value="<%- config_cmd %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure command" data-content="The optional command to run before the build system is invoked."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="configure-options" class="form-group">
								<label class="control-label">Configure options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="4000" value="<%- config_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure options" data-content="The arguments to pass to the configure command."></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div id="build-settings" class="well">
							<h3><i class="fa fa-puzzle-piece"></i>Build settings</h3>

							<div id="build-path" class="form-group">
								<label class="control-label">Build path</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="1000" value="<%- build_dir %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build Path" data-content="The path to run the build command from, relative to the package path.  If no path is provided, '.' is assumed."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="select-build-path" class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div id="build-file" class="form-group"<% if (!build_system || build_system == 'no-build') { %> style="display:none"<% } %>>
								<label class="control-label">Build file</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="1000" <% if (build_file) { %> value="<%- build_file %>" <% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build file" data-content="The path to the file containing instructions used by the build system, relative to the build path.  If no file is specified, then the system will search the build path for a file with a name that is standard for the build system that you are using (i.e. 'build.xml' for Ant, 'pom.xml' for Maven etc.)"></i>
										</div>
								 	</div>
								 </div>
								 <div class="buttons">
								 	<button id="select-build-file" class="btn"><i class="fa fa-list"></i>Select</button>
								 </div>
							</div>

							<div id="build-options" class="form-group"<% if (!build_system || build_system == 'no-build') { %> style="display:none"<% } %>>
								<label class="control-label">Build options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="200" value="<%- build_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build Options" data-content="Additional options to pass to the build system."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="build-target" class="form-group"<% if (!build_system || build_system == 'no-build') { %> style="display:none"<% } %>>
								<label class="control-label">Build target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="200" value="<%- build_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build target" data-content="This is the name of the target that is created during the build.  If no target is provided, then the default target specified by the build file will be used."></i>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</fieldset>
</form>

<div align="right">
	<label><span class="required"></span>Fields are required</label>
</div>
	
<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>