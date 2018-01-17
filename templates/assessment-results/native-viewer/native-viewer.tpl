<h1>
	<div class="icon"><i class="fa fa-bug"></i></div>
	<span id="title">Native Viewer Report</span>
	<% if (numPages > 1) { %>
	(Page <%= pageNumber %> / <%= numPages %>)
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-bug"></i><span id="breadcrumb">Native Viewer Report</span></li>
</ol>

<h2>Summary</h2>
<div id="assessment-profile" class="form-horizontal well">

	<div class="form-group">
		<label class="form-label">Package</label>
		<div class="controls">
			<% var packageName = ((AnalyzerReport.package && AnalyzerReport.package.name)? AnalyzerReport.package.name : AnalyzerReport.package_name); %>
			<% var packageVersion = ((AnalyzerReport.package && AnalyzerReport.package.version_string)? AnalyzerReport.package.version_string : AnalyzerReport.package_version); %>

			<% if (packageName) { %>
			<% if (packageUrl) { %>
			<a href="<%= packageUrl %>"><%= packageName %></a>
			<% } else { %>
			<%= packageName %>
			<% } %>
			<% } %>

			<% if (packageVersion) { %>
			<b>version</b>
			<% if (packageVersionUrl) { %>
			<a href="<%= packageVersionUrl %>"><b class="version"><%= packageVersion %></b></a>
			<% } else { %>
			<b class="version"><%= packageVersion %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Tool</label>
		<div class="controls">
			<% var toolName = ((AnalyzerReport.tool && AnalyzerReport.tool.name)? AnalyzerReport.tool.name : AnalyzerReport.tool_name); %>
			<% var toolVersion = ((AnalyzerReport.tool && AnalyzerReport.tool.version_string)? AnalyzerReport.tool.version_string : AnalyzerReport.tool_version); %>

			<% if (toolName) { %>
			<% if (toolUrl) { %>
			<a href="<%= toolUrl %>"><%= toolName %></a>
			<% } else { %>
			<%= toolName %>
			<% } %>
			<% } %>

			<% if (toolVersion) { %>
			<b>version</b>
			<% if (toolVersionUrl) { %>
			<a href="<%= toolVersionUrl %>"><b class="version"><%= toolVersion %></b></a>
			<% } else { %>
			<b class="version"><%= toolVersion %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Platform</label>
		<div class="controls">
			<% var platformName = ((AnalyzerReport.platform && AnalyzerReport.platform.name)? AnalyzerReport.platform.name : AnalyzerReport.platform_name); %>
			<% var platformVersion = ((AnalyzerReport.platform && AnalyzerReport.platform.version_string)? AnalyzerReport.platform.version_string : AnalyzerReport.platform_version); %>

			<% if (platformName) { %>
			<% if (platformUrl) { %>
			<a href="<%= platformUrl %>"><%= platformName %></a>
			<% } else { %>
			<%= platformName %>
			<% } %>
			<% } %>

			<% if (platformVersion) { %>
			<b>version</b>
			<% if (platformVersionUrl) { %>
			<a href="<%= platformVersionUrl %>"><b class="version"><%= platformVersion %></b></a>
			<% } else { %>
			<b class="version"><%= platformVersion %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Number of weaknesses found</label>
		<div class="controls">
			<span class="warning"><%= AnalyzerReport.BugCount %></span>
		</div>
	</div>

	<% if (AnalyzerReport.create_date) { %>
	<div class="form-group">
		<label class="form-label">Create date</label>
		<div class="controls">
			<%= dateToDetailedHTML(new Date(AnalyzerReport.create_date)) %>
		</div>
	</div>
	<% } %>
</div>

<h2>Results</h2>
<div id="weaknesses-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading weaknesses...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<label>
	<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
	Show grouping
</label>

<div id="nav-button-bar" class="pull-right" style="margin-top:15px"></div>
