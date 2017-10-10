<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Android source build info</legend>

		<div class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select id="build-system" name="build-system" data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the system used to build the package (i.e. 'ant' etc)." >
					<option value="none"></option>
					<option <% if (build_system == 'android+ant') { %> selected <% } %>
						value="ant">Ant</option>
					<option <% if (build_system == 'android+maven') { %> selected <% } %>
						value="maven">Maven</option>
					<option <% if (build_system == 'android+gradle') { %> selected <% } %>
						value="gradle">Gradle</option>
				</select>
			</div>
		</div>

		<div class="form-group">
			<% var showBuildSystem = maven_version || android_maven_plugin || build_system == 'android+gradle'; %>
			<% var showAndroid = android_sdk_target || android_lint_target || android_redo_build; %>
			<% var showConfigure = config_dir || config_cmd || config_opt; %>
			<% var showBuild = build_dir || build_file || build_opt || build_target || model.isNew(); %>
			<% var showAdvanced = true; %>
			
			<div class="panel" id="advanced-settings-accordion"<% if (!build_system || build_system == 'no-build') { %> style="display:none" <% } %>>
				<div class="panel-group">
					<div class="panel-heading">
						<label>
						<a class="accordion-toggle" data-toggle="collapse" data-parent="#advanced-settings-accordion" href="#advanced-settings">
							<% if (showAdvanced) { %>
							<i class="fa fa-minus-circle"></i>
							<% } else { %>
							<i class="fa fa-plus-circle"></i>
							<% } %>
							Advanced settings
						</a>
						</label>

						<span class="tags">
							<span class="<% if (!showBuildSystem) { %>collapsed <% } %>toggle build-system tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#build-system-settings" data-toggle="button"<% if (!showBuildSystem) { %> style="display:none"<% } %>><i class="fa fa-tasks"></i>Build system</span>
							<span class="<% if (!showAndroid) { %>collapsed <% } %>toggle android tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#android-settings"><i class="fa fa-android"></i>Android</span>
							<span class="<% if (!showConfigure) { %>collapsed <% } %>toggle configure tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#configure-settings"><i class="fa fa-gear"></i>Configure</span>
							<span class="<% if (!showBuild) { %>collapsed <% } %>toggle build tag accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#build-settings"><i class="fa fa-puzzle-piece"></i>Build</span>
						</span>
					</div>
					<div id="advanced-settings" class="nested accordion-body collapse<% if (showAdvanced) { %> in<% } %>">

						<div id="build-system-settings" class="well collapse<% if (showBuildSystem) { %> in<% } %>"<% if (build_system != 'android+maven' && build_system != 'android+gradle') { %> style="display:none"<% } %>>
							<h3><i class="fa fa-tasks"></i>Build system settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#build-system-settings" /></h3>

							<div class="maven-settings form-group"<% if (build_system != 'android+maven') { %> style="display:none"<% } %>>
								<label class="control-label">Maven version</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="maven-version" <% if (typeof maven_version !== 'undefined') {%>value="<%- maven_version %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Maven version" data-content="This is a string that describes the version of Maven to be used. This may need to be specified if the package requires a particular version of Maven to compile correctly"></i>
										</div>
									</div>
								</div>
							</div>

							<div class="maven-settings form-group"<% if (build_system != 'android+maven') { %> style="display:none"<% } %>>
								<label class="control-label">Android Maven plugin</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="android-maven-plugin" <% if (typeof android_maven_plugin !== 'undefined') { %>value="<%- android_maven_plugin %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android Maven plugin" data-content="This is a string that describes the version of Android Maven plugin to be used. The version used at build-time may be upgraded to be compatible with the Android SDK."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="gradle-settings form-group" <% if (build_system != 'android+gradle') { %>style="display:none"<% } %>>
								<label class="control-label">Use Gradle wrapper</label>
								<div class="controls">
									<input type="checkbox" id="use-gradle-wrapper" <% if (typeof use_gradle_wrapper !== 'undefined' && use_gradle_wrapper) { %>checked<% } %>>
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Use Gradle wrapper" data-content="The gradle wrapper is a standard way of making a gradle package use a specific version of gradle, which it may require. Some packages will work with any gradle, some only with the gradle wrapper mechanism. Check the documentation"></i>
								</div>
							</div>
						</div>

						<div id="android-settings" class="well collapse<% if (showAndroid) { %> in<% } %>">
							<h3><i class="fa fa-android"></i>Android settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#android-settings" /></h3>

							<div class="form-group">
								<label class="control-label">Android SDK target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="android-sdk-target" value="<%- android_sdk_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android SDK target" data-content="This is a string that describes the target Android SDK version."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Android lint target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" class="form-control" id="android-lint-target" <% if (typeof android_lint_target !== 'undefined') {%>value="<%- android_lint_target %>"<% } %>>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Android lint target" data-content="The SWAMP uses the android standard target of 'lint'. Some android builds disable this normal lint target. Others require a specific lint target per build command. If android lint fails, or you would like to see different lint target output in the SWAMP, please read the documentation and select the appropriate lint target."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="ant-settings form-group"<% if (build_system != 'android+ant') { %> style="display:none" <% } %>>
								<label class="control-label">Android redo build</label>
								<div class="controls">
									<input type="checkbox" id="android-redo-build" data-toggle="popover" data-placement="right"  <% if (android_redo_build) { %> checked <% } %>>
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Android redo build" data-content="This is whether or not to attempt to infer the manifest file and redo the build from the package contents."></i>
								</div>
							</div>
						</div>
						
						<div id="configure-settings" class="well collapse<% if (showConfigure) { %> in<% } %>">
							<h3><i class="fa fa-gear"></i>Configure settings<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#configure-settings" /></h3>

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
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build Path" data-content="The path to run the build command from, relative to the package path.  If no path is provided, '.' is assumed."></i>
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
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build file" data-content="The path to the file containing instructions used by the build system, relative to the build path.  If no file is specified, then the system will search the build path for a file with a name that is standard for the build system that you are using (i.e. 'build.xml' for Ant, 'pom.xml' for Maven etc.)"></i>
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
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build Options" data-content="Additional options to pass to the build system."></i>
										</div>
									</div>
								</div>
							</div>

							<% var otherAntBuildTarget = build_system == 'android+ant' && build_target != 'release' && build_target != 'debug'; %>
							<% var otherGradleBuildTarget = build_system == 'android+gradle' && build_target != 'compileReleaseSources' && build_target != 'compileDebugSources'; %>
							<% var otherBuildTarget = otherAntBuildTarget || otherGradleBuildTarget; %>

							<div class="form-group">
								<label class="required control-label">Build target</label>
								<div id="build-target" name="build-target" class="controls">

									<select data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the target that is created during the build."<% if (build_system != 'android+gradle' && build_system != 'android+ant') { %> style="display:none"<% } %>>

										<!-- gradle build target options -->
										<option class="gradle-settings"
											<% if (build_system != 'android+gradle') { %> style="display:none" <% } %>
											<% if (build_system == 'android+gradle' && build_target == 'compileReleaseSources') { %> selected <% } %>
											value="compileReleaseSources">compileReleaseSources
										</option>
										<option class="gradle-settings"
											<% if (build_system != 'android+gradle') { %> style="display:none" <% } %>
											<% if (build_system == 'android+gradle' && build_target == 'compileDebugSources') { %> selected <% } %> 
											value="compileDebugSources">compileDebugSources
										</option>

										<!-- ant build target options -->
										<option class="ant-settings"
											<% if (build_system != 'android+ant') { %> style="display:none" <% } %>
											<% if (build_system == 'android+ant' && build_target == 'release') { %> selected <% } %>
											value="release">release
										</option>
										<option class="ant-settings"
											<% if (build_system != 'android+ant') { %> style="display:none" <% } %>
											<% if (build_system == 'android+ant' && build_target == 'debug') { %> selected <% } %> 
											value="debug">debug
										</option>

										<!-- other build target options -->
										<option
											<% if (otherBuildTarget) { %> selected <% } %>
											value="other">other
										</option>
									</select>

									<div class="maven-settings input-group"<% if (build_system != 'android+maven') { %> style="display:none"<% } %>>
										<input type="text" name="build-target" class="form-control" value="<%- build_target %>">
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Build target" data-content="This is the name of the target that is created during the build."></i>
										</div>
									</div>
								</div>
							</div>

							<div class="form-group"
								<% if (!otherBuildTarget) { %> style="display:none"<% } %>>
								<label class="required control-label">Other build target</label>
								<div class="controls">
									<div class="input-group">
										<input type="text" name="build-target" class="required form-control" id="other-build-target" <% if (otherBuildTarget) { %> value="<%- build_target %>" <% } %>>
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