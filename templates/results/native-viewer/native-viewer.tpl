<h1>
	<div class="icon"><i class="fa fa-bug"></i></div>
	<span id="title">Native Viewer Report</span>
	<% if (typeof numPages != 'undefined' && numPages > 1) { %>
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
			<% var packageName = ((report.package && report.package.name)? report.package.name : report.package_name); %>
			<% var packageVersion = ((report.package && report.package.version_string)? report.package.version_string : report.package_version); %>

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
			<% var toolName = ((report.tool && report.tool.name)? report.tool.name : report.tool_name); %>
			<% var toolVersion = ((report.tool && report.tool.version_string)? report.tool.version_string : report.tool_version); %>

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
			<% var platformName = ((report.platform && report.platform.name)? report.platform.name : report.platform_name); %>
			<% var platformVersion = ((report.platform && report.platform.version_string)? report.platform.version_string : report.platform_version); %>

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
			<span class="warning"><%= report.BugCount? report.BugCount.toLocaleString() : 0 %></span>
		</div>
	</div>

	<% if (report.create_date) { %>
	<div class="form-group">
		<label class="form-label">Create date</label>
		<div class="controls">
			<%= datetimeToHTML(new Date(report.create_date.replace(/-/g, '/'))) %>
		</div>
	</div>
	<% } %>
</div>

<h2>Results</h2>

<ul class="nav nav-tabs">
	<li id="list" class="nav-item active">
		<a role="tab" data-toggle="tab" href="#list-panel"><i class="fa fa-list"></i>List</a>
	</li>

	<li id="tree" class="nav-item">
		<a role="tab" data-toggle="tab" href="#tree-panel"><i class="fa fa-tree"></i>Tree</a>
	</li>

	<div class="top buttons" style="float:right; margin-bottom:-10px">
		<button id="filter" class="btn btn-primary"><i class="fa fa-filter"></i>Filter</button>
	</div>
</ul>

<div class="tab-content">
	<div id="list-panel" role="tabpanel" class="tab-pane active">
		<div id="weakness-list"></div>

		<label>
			<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
			Show numbering
		</label>

		<label>
			<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
			Show grouping
		</label>

		<div id="nav-button-bar" class="pull-right" style="margin-top:15px"></div>
	</div>

	<div id="tree-panel" role="tabpanel" class="tab-pane">
		<div id="source-tree"></div>
	</div>
</div>