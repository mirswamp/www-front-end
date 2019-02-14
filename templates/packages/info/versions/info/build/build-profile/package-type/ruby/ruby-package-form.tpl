<% if (build_system != 'ruby-gem') { %>
<p>The following parameters are used to configure the build script which is used to build this ruby package. </p>
<br />
<% } %>

<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Ruby build info</legend>
		<div id="build-system" class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select name="build-system" data-toggle="popover" data-placement="right" title="Build system" data-content="This is the name of the system used to build the package (i.e. 'make' etc)." >
					<% if (build_system == 'ruby-gem') { %>
					<option selected value="ruby-gem">Gem</option>
					<% } else { %>
					<option disabled></option>
					<option <% if (build_system == 'bundler') { %> selected <% } %> 
						value="bundler">Bundler</option>
					<option <% if (build_system == 'bundler+rake') { %> selected <% } %> 
						value="bundler-rake">Bundler + Rake</option>
					<option <% if (build_system == 'bundler+other') { %> selected <% } %> 
						value="bundler-other">Bundler + Other</option>
					<option <% if (build_system == 'rake') { %> selected <% } %> 
						value="rake">Rake</option>
					<option <% if (build_system == 'other') { %> selected <% } %>
						value="other">Other</option>
					<option <% if (!build_system || build_system == 'no-build') { %> selected <% } %> 
						value="no-build">None</option>
					<% } %>
				</select>
			</div>
		</div>

		<div id="other-build-command" class="form-group"<% if (build_system != 'other' && build_system != 'bundler+other') { %> style="display:none" <% } %>>
			<label class="required control-label">Build command</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" maxlength="4000" value="<%- build_cmd %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build command" data-content="The command to run to compile your package (e.g. gcc -c *.c)"></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<% var showConfigure = (build_system != 'ruby-gem'); %>
			<% var expandConfigure = (config_dir || config_cmd || config_opt); %>
			<% var showBuild = (build_system && build_system != 'none' && build_system != 'no-build' && build_system != 'bundler'); %>
			<% var expandBuild = (build_dir || build_file || build_opt || build_target); %>
			<% var showAdvanced = (build_system != 'ruby-gem'); %>

			<div id="advanced-settings" class="panel"<% if (!showAdvanced) { %> style="display:none" <% } %>>
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
						<span class="tags">
							<span class="<% if (!expandConfigure) { %>collapsed <% } %>toggle tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#configure-settings"<% if (!showConfigure) { %> style="display:none"<% } %>><i class="fa fa-tasks"></i>Configure</span>
							<span class="<% if (!expandBuild) { %>collapsed <% } %>toggle tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#build-settings"<% if (!showBuild) { %> style="display:none"<% } %>><i class="fa fa-puzzle-piece"></i>Build</span>
						</span>
					</div>
					
					<div class="nested">
						<div id="configure-settings" class="well collapse<% if (expandConfigure) { %> in<% } %>">
							<h3><i class="fa fa-tasks"></i>Configure settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#configure-settings" /></h3>

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
									<button class="btn"><i class="fa fa-list"></i>Select</button>
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

						<div id="build-settings" class="well collapse<% if (expandBuild) { %> in<% } %>">
							<h3><i class="fa fa-puzzle-piece"></i>Build settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#build-settings" /></h3>

							<div id="build-path" class="form-group">
								<label class="control-label">Build path</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="1000" value="<%- build_dir %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build path" data-content="The path to run the build command from, relative to the package path.  If no path is provided, '.' is assumed."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div id="build-file" class="form-group"<% if (!build_system || build_system == 'none' || build_system =='other' || build_system == 'bundler+other') { %> style="display:none"<% } %>>
								<label class="control-label">Build file</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="1000" <% if (build_file) { %> value="<%- build_file %>" <% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build file" data-content="The path to the file containing instructions used by the build system, relative to the build path.  If no file is specified, then the system will search the build path for a file with a name that is standard for the build system that you are using (i.e. 'Makefile' for make etc.)"></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div id="build-options" class="form-group"<% if (!build_system || build_system == 'none') { %> style="display:none"<% } %>>
								<label class="control-label">Build options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="4000" value="<%- build_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build options" data-content="Additional options to pass to the build system."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="build-target" class="form-group"<% if (!build_system || build_system == 'none') { %> style="display:none"<% } %>>
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

						<div id="exclude-paths" class="form-group">
							<label class="control-label">Exclude paths</label>
							<div class="controls">
								<div class="input-group">
									<input type="text" class="form-control" maxlength="1000" value="<%- exclude_paths %>">
									<div class="input-group-addon">
										<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build path" data-content="A comma separated list of paths to exclude from the build relative to the package path."></i>
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

<% if (build_system != 'ruby-gem') { %>
<div align="right">
	<label><span class="required"></span>Fields are required</label>
</div>
<% } %>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>