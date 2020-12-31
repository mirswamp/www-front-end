<p>The following parameters are used to configure the build script which is used to build this android package. </p>
<br />

<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Android source build info</legend>

		<div id="build-system" class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select name="build-system" data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the system used to build the package (i.e. 'ant' etc)." >
					<option disabled></option>
					<option <% if (build_system == 'android+ant') { %> selected <% } %>
						value="ant">Ant</option>
					<option <% if (build_system == 'android+maven') { %> selected <% } %>
						value="maven">Maven</option>
					<option <% if (build_system == 'android+gradle' || build_system == 'android+gradle-wrapper') { %> selected <% } %>
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

							<div id="maven-version" class="maven-settings form-group"<% if (build_system != 'android+maven') { %> style="display:none"<% } %>>
								<label class="control-label">Maven version</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" <% if (typeof maven_version !== 'undefined') {%>value="<%- maven_version %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Maven version" data-content="This is a string that describes the version of Maven to be used. This may need to be specified if the package requires a particular version of Maven to compile correctly"></i>
										</div>
									</div>
								</div>
							</div>

							<div id="android-maven-plugin" class="maven-settings form-group"<% if (build_system != 'android+maven') { %> style="display:none"<% } %>>
								<label class="control-label">Android Maven plugin</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control"<% if (typeof android_maven_plugin !== 'undefined') { %> value="<%- android_maven_plugin %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android Maven plugin" data-content="This is a string that describes the version of Android Maven plugin to be used. The version used at build-time may be upgraded to be compatible with the Android SDK."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="use-gradle-wrapper" class="gradle-settings form-group" <% if (!(build_system == 'android+gradle'|| build_system == 'android+gradle-wrapper')) { %>style="display:none"<% } %>>
								<label class="control-label">Use Gradle wrapper</label>
								<div class="controls">
									<input type="checkbox" <% if (typeof use_gradle_wrapper !== 'undefined' && use_gradle_wrapper || build_system == 'android+gradle-wrapper') { %>checked<% } %>>
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Use Gradle wrapper" data-content="The gradle wrapper is a standard way of making a gradle package use a specific version of gradle, which it may require. Some packages will work with any gradle, some only with the gradle wrapper mechanism. Check the documentation"></i>
								</div>
							</div>
						</div>

						<div id="android-settings" class="well">
							<h3><i class="fa fa-android"></i>Android settings</h3>

							<div id="android-sdk-target" class="form-group">
								<label class="control-label">Android SDK target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" value="<%- android_sdk_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android SDK target" data-content="This is a string that describes the target Android SDK version."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="android-lint-target" class="form-group">
								<label class="control-label">Android lint target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" <% if (typeof android_lint_target !== 'undefined') {%>value="<%- android_lint_target %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android lint target" data-content="We use the android standard target of 'lint'. Some android builds disable this normal lint target. Others require a specific lint target per build command. If android lint fails, or you would like to see different lint target output, please read the documentation and select the appropriate lint target."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="android-redo-build" class="ant-settings form-group"<% if (build_system != 'android+ant') { %> style="display:none" <% } %>>
								<label class="control-label">Android redo build</label>
								<div class="controls">
									<input type="checkbox" data-toggle="popover" data-placement="right"  <% if (android_redo_build) { %> checked <% } %>>
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Android redo build" data-content="This is whether or not to attempt to infer the manifest file and redo the build from the package contents."></i>
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

							<div id="build-file" class="form-group">
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

							<div id="build-options" class="form-group">
								<label class="control-label">Build options</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" maxlength="4000" value="<%- build_opt %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build Options" data-content="Additional options to pass to the build system."></i>
										</div>
									</div>
								</div>
							</div>

							<% if (build_system == 'android+gradle' && model.isNew()) { build_target = 'compileReleaseSources' }; %>
							<% var otherBuildTarget = (build_system == 'android+ant' || build_system == 'android+gradle') && (build_target != 'compileReleaseSources' && build_target != 'compileDebugSources'); %>

							<div id="build-target" class="form-group">
								<label class="required control-label">Build target</label>
								<div name="build-target" class="controls">

									<select data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the target that is created during the build."<% if (build_system != 'android+gradle' && build_system != 'android+ant') { %> style="display:none";<% } %>>

										<!-- gradle build target options -->
										<option class="gradle-settings" value="compileReleaseSources"
											<% if (!otherBuildTarget && build_target == 'compileReleaseSources') { %> selected <% } %><% if (build_system != 'android+gradle') { %> style="display:none" <% } %>>
											compileReleaseSources
										</option>
										<option class="gradle-settings" value="compileDebugSources"
											<% if (!otherBuildTarget && build_target == 'compileDebugSources') { %> selected <% } %><% if (build_system != 'android+gradle') { %> style="display:none" <% } %>>
											compileDebugSources
										</option>

										<!-- ant build target options -->
										<option class="ant-settings" value="release"
											<% if (build_system != 'android+ant') { %> style="display:none" <% } %>
											<% if (!otherBuildTarget && build_target == 'release') { %> selected <% } %>>
											release
										</option>
										<option class="ant-settings" value="debug"
											<% if (build_system != 'android+ant') { %> style="display:none" <% } %>
											<% if (!otherBuildTarget && build_target == 'debug') { %> selected <% } %>>
											debug
										</option>

										<!-- other build target options -->
										<option value="other"
											<% if (otherBuildTarget) { %> selected="selected" <% } %>>
											other
										</option>
									</select>

									<div class="maven-settings input-group"<% if (!build_target || build_system != 'android+maven') { %> style="display:none"<% } %>>
										<input type="text" name="build-target" class="required form-control" value="<%- build_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build target" data-content="This is the name of the target that is created during the build."></i>
										</div>
									</div>
								</div>
							</div>

							<div id="other-build-target" class="form-group"
								<% if (!otherBuildTarget) { %> style="display:none"<% } %>>
								<label class="required control-label">Other build target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" name="other-build-target" class="required form-control" <% if (otherBuildTarget) { %> value="<%- build_target %>" <% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build target" data-content="This is the name of the target that is created during the build."></i>
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