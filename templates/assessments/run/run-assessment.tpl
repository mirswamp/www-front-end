<h1>
	<div class="icon"><i class="fa fa-play"></i></div>
	<% if (project.isTrialProject()) { %>
	Run New Assessment
	<% } else { %>
	Run New <span class="name"><%- project.get('short_name') %></span> Assessment
	<% } %>

	<% if (package) { %>
	of <span class="name"><%- package.get('name') %></span>
	<% } %>

	<% if (packageVersion) { %>
	Version <span class="name"><%- typeof packageVersion == 'string'? packageVersion.toTitleCase() : packageVersion.get('version_string') %></span>
	<% } %>

	<% if (tool) { %>
	using <span class="name"><%- tool.get('name') %></span>
	<% } %>

	<% if (toolVersion) { %>
	Version <span class="name"><%- typeof toolVersion == 'string'? toolVersion.toTitleCase() : toolVersion.get('version_string') %></span>
	<% } %>

	<% if (platform) { %>
	on <span class="name"><%- platform.get('name') %></span>
	<% } %>

	<% if (platformVersion) { %>
	Version <span class="name"><%- typeof platformVersion == 'string'? platformVersion.toTitleCase() : platformVersion.get('version_string') %></span>
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<% if (project.isTrialProject()) { %>
	<li><a href="#assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<% } else { %>
	<li><a href="#assessments?project=<%- project.get('project_uid') %>"><i class="fa fa-check"></i><%- project.get('short_name') %> Assessments</a></li>
	<% } %>

	<% if (project.isTrialProject()) { %>
	<li><i class="fa fa-plus"></i>Run New Assessment</li>
	<% } else { %>
	<li><i class="fa fa-plus"></i>Run New <span class="name"><%- project.get('short_name') %></span> Assessment</li>
	<% } %>
</ol>

<p>To create a new assessment, please specify the following information:</p>

<div class="panel" id="package-selection"<% if (packageVersion) { %> style="display:none"<% } %>>
	<div class="panel-header">
		<h2><i class="fa fa-gift"></i>Package</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls"<% if (package) { %> style="display:none"<% } %>>
			Select a <a href="#packages">package</a> to assess:
			<div id="package-selector"></div>
		</div>
		<div class="form-group controls"<% if (package) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="package-version-selector"></div>
		</div>
	</div>
</div>

<div class="panel" id="tool-selection" style="display:none">
	<div class="panel-header">
		<h2><i class="fa fa-wrench"></i>Tool</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls"<% if (tool) { %> style="display:none"<% } %>>
			Select a <a href="#tools/public">tool</a> to use:
			<div id="tool-selector"></div>
		</div>
		<div class="form-group controls"<% if (tool) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="tool-version-selector"></div>
		</div>
	</div>
</div>

<div class="panel" id="platform-selection" style="display:none">
	<div class="panel-header">
		<h2><i class="fa fa-bars"></i>Platform</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls"<% if (platform) { %> style="display:none"<% } %>>
			Select a <a href="#platforms/public">platform</a> to use:
			<div id="platform-selector"></div>
		</div>
		<div class="form-group controls"<% if (platform) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="platform-version-selector"></div>
		</div>
	</div>
</div>

<div class="bottom buttons">
	<button id="save-and-run" class="btn btn-primary btn-lg" disabled><i class="fa fa-play"></i>Save and Run</button>
	<button id="save" class="btn btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
