<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Ruby build info</legend>

		<div class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select id="build-system" name="build-system" data-toggle="popover" data-placement="right" title="Build system" data-content="This is the name of the system used to build the package (i.e. 'make' etc)." >
					<% if (build_system != 'ruby-gem') { %>
					<option value="none"></option>
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
						value="no-build">No Build</option>
					<% } %>
					<option <% if (build_system == 'ruby-gem') { %> selected <% } %> 
						value="ruby-gem">Ruby Gem</option>
				</select>
			</div>
		</div>

		<div class="form-group" <% if (build_system != 'other') { %> style="display:none" <% } %> >
			<label class="required control-label">Build command</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" id="other-build-command" maxlength="4000" value="<%- build_cmd %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build command" data-content="The command to run to compile your package (e.g. gcc -c *.c)"></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<% var showConfigure = config_dir || config_cmd || config_opt; %>
			<% var showBuild = build_system && build_system != 'no-build' && (build_dir || exclude_paths || build_file || build_opt || build_target); %>
			<% var showAdvanced = build_system != 'ruby-gem'; %>

			<div id="advanced-settings" class="panel"<% if (!showAdvanced) { %> style="display:none" <% } %> >
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
						<span class="tags">
							<span class="<% if (!showConfigure) { %>collapsed <% } %>toggle tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#configure-settings"<% if (!build_system || build_system == 'no-build') { %> style="display:none"<% } %>><i class="fa fa-tasks"></i>Configure</span>
							<span class="<% if (!showBuild) { %>collapsed <% } %>toggle tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#build-settings"<% if (!build_system || build_system == 'no-build') { %> style="display:none"<% } %>><i class="fa fa-puzzle-piece"></i>Build</span>
						</span>
					</div>
					
					<div class="nested">
						<div id="configure-settings" class="well collapse<% if (showConfigure) { %> in<% } %>">
							<h3><i class="fa fa-tasks"></i>Configure settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#configure-settings" /></h3>

							<div class="form-group">
								<label class="control-label">Configure path</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="configure-path" maxlength="1000" value="<%- config_dir %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure path" data-content="The optional path to run the configure command from, relative to the package path. If no path is provided, '.' is assumed."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="select-configure-path" class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Configure command</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="configure-command" maxlength="4000" value="<%- config_cmd %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure command" data-content="The optional command to run before the build system is invoked."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Configure options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="configure-options" maxlength="4000" value="<%- config_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Configure options" data-content="The arguments to pass to the configure command."></i>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div id="build-settings" class="well collapse<% if (showBuild) { %> in<% } %>">
							<h3><i class="fa fa-puzzle-piece"></i>Build settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#build-settings" /></h3>

							<div class="form-group">
								<label class="control-label">Build path</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="build-path" maxlength="1000" value="<%- build_dir %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build path" data-content="The path to run the build command from, relative to the package path.  If no path is provided, '.' is assumed."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="select-build-path" class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Build file</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="build-file" maxlength="1000" <% if (build_file) { %> value="<%- build_file %>" <% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build file" data-content="The path to the file containing instructions used by the build system, relative to the build path.  If no file is specified, then the system will search the build path for a file with a name that is standard for the build system that you are using (i.e. 'Makefile' for make etc.)"></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="select-build-file" class="btn"><i class="fa fa-list"></i>Select</button>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Build options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="build-options" maxlength="4000" value="<%- build_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build options" data-content="Additional options to pass to the build system."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Build target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="build-target" maxlength="200" value="<%- build_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build target" data-content="This is the name of the target that is created during the build.  If no target is provided, then the default target specified by the build file will be used."></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label">Exclude paths</label>
							<div class="controls">
								<div class="input-group">
									<input type="text" class="form-control" id="exclude-paths" maxlength="1000" value="<%- exclude_paths %>">
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