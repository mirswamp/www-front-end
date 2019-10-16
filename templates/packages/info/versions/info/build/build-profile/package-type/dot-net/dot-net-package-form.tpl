<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>.NET build info</legend>

		<% if (package_info && package_info.sln_files) { %>
		<% var solutions = package_info.sln_files; %>
		<% if (solutions) { %>
		<% var solutionNames = Object.keys(solutions); %>
		<% if (solutionNames.length > 0) { %>
		<div class="solution form-group">
			<label class="control-label">Solution</label>
			<div class="controls">
				<select data-toggle="popover" data-placement="right" title="Solution" data-content="This is the solution to build." >
					<% var buildSolution = package_build_settings? package_build_settings.sln_file : null; %>
					<% var buildSolutionName = buildSolution? Object.keys(buildSolutions)[0] : null; %>

					<% for (var i = 0; i < solutionNames.length; i++) { %>
					<% var solutionName = solutionNames[i]; %>
					<option index="<%= i %>"><%= solutionName %><% if (solutionName == buildSolutionName) { %> selected<% } %></option>
					<% } %>					
				</select>
			</div>
		</div>

		<br />
		<% } %>
		<% } %>
		<% } %>

		<% if (package_info) { %>
		<% var projects = package_info.proj_files; %>
		<% var projectNames = Object.keys(projects).sort(); %>
		<% var buildProjects = package_build_settings? package_build_settings.proj_files : {}; %>
		<% var buildProjectNames = Object.keys(buildProjects); %>

		<% for (var i = 0; i < projectNames.length; i++) { %>
		<% var projectName = projectNames[i]; %>
		<% var project = projects[projectName]; %>
		<% if (!solutions) { %>
		<% projectName = projectName.replace(source_path, ''); %>
		<% } %>
		<% var buildProject = buildProjects[projectName]; %>
		<% var noBuild = buildProject && buildProject['nobuild']; %>
		
		<% var solutionClasses = []; %>
		<% if (solutions) { %>
		<% var hidden = true; %>
		<% for (var j = 0; j < solutionNames.length; j++) { %>
		<% var solutionName = solutionNames[j]; %>
		<% var solution = solutions[solutionName]; %>
		<% if (solution.contains(projectName)) { %>
		<% solutionClasses.push('solution' + j); %>
		<% if (j == 0) { hidden = false; } %>
		<% } %>
		<% } %>
		<% } %>

		<% var warnings = []; %>
		<% if (package_info.warnings) { %>
		<% for (var w = 0; w < package_info.warnings.length; w++) { %>
		<% var warning = package_info.warnings[w]; %>
		<% if (warning.file == projectName) { warnings.push(warning); } %>
		<% } %>
		<% } %>

		<% var projectEnabled = (buildProjectNames.length == 0 || buildProjectNames.contains(projectName)) && !noBuild && warnings.length == 0; %>
		<% var projectDisabled = (warnings.length != 0); %>

		<div class="well project <%= solutionClasses.join(' ') %>"<% if (hidden) { %> style="display:none"<% } %>>

			<div class="name form-group">
				<label class="control-label">Project</label>
				<div class="controls">
					<div class="checkbox-inline">
						<input type="checkbox"<% if (projectEnabled) { %> checked<% } %><% if (projectDisabled) { %> disabled<% } %>/>
						<%= textToHtml(projectName) %>
					</div>
				</div>
			</div>

			<% var frameworks = project.frameworks; %>
			<% if (frameworks) { %>
			<div class="framework form-group">
				<label class="control-label">Framework</label>
				<div class="controls">
					<% var selected_framework = buildProject? buildProject.framework : project.default_framework; %>

					<% for (var j = 0; j < frameworks.length; j++) { %>
					<% var framework = frameworks[j]; %>
					<div class="radio-inline">
						<label>
							<input type="radio" value="<%= j %>" name="framework<%= i %>"<% if (framework == selected_framework || !selected_framework && j == 0) { %> checked<% } %><% if (!projectEnabled) { %> disabled<% } %> />
							<%= framework %>
						</label>
					</div>
					<% } %>
				</div>
			</div>
			<% } %>

			<% var configurations = project.configurations; %>
			<% if (configurations) { %>
			<div class="configuration form-group">
				<label class="control-label">Configuration</label>
				<div class="controls">
					<% var selected_configuration = buildProject? buildProject.configuration : project.default_configuration; %>

					<% for (var j = 0; j < configurations.length; j++) { %>
					<% var configuration = configurations[j]; %>
					<div class="radio-inline">
						<label>
							<input type="radio" value="<%= j %>" name="configuration<%= i %>"<% if (configuration == selected_configuration || !selected_configuration && j == 0) { %> checked<% } %><% if (!projectEnabled) { %> disabled<% } %> />
							<%= configuration %>
						</label>
					</div>
					<% } %>
				</div>
			</div>
			<% } %>

			<% if (warnings.length > 0) { %>
			<div class="warning form-group">
				<label class="control-label">Note</label>
				<div class="controls">
					<% for (var j = 0; j < warnings.length; j++) { %>
					<div class="form-control-static"><%= textToHtml(warning.code) %> - <%= textToHtml(warning.message) %></div>
					<% } %>
				</div>
			</div>
			<% } %>

		</div>
		<% } %>
		<% } else { %>
		No .NET projects found.
		<% } %>
	</fieldset>
</form>