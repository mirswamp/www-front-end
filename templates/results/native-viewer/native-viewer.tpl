<h1>
	<div class="icon"><i class="fa fa-bug"></i></div>
	<span id="title">Native Viewer Report</span>
	<% if (typeof numPages !== 'undefined' && numPages > 1) { %>
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

			<% if (typeof package !== 'undefined') { %>
			<% if (package_url) { %>
			<a href="<%= package_url %>" target="_blank"><%= package.name %></a>
			<% } else { %>
			<%= package.name %>
			<% } %>
			<% } %>

			<% if (typeof package !== 'undefined') { %>
			<b>version</b>
			<% if (typeof package_version_url !== 'undefined') { %>
			<a href="<%= package_version_url %>" target="_blank"><b class="version"><%= package.version_string%></b></a>
			<% } else { %>
			<b class="version"><%= package.version_string %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Tool</label>
		<div class="controls">

			<% if (typeof tool !== 'undefined') { %>
			<% if (typeof tool_url !== 'undefined') { %>
			<a href="<%= tool_url %>" target="_blank"><%= tool.name %></a>
			<% } else { %>
			<%= tool.name %>
			<% } %>
			<% } %>

			<% if (typeof tool !== 'undefined') { %>
			<b>version</b>
			<% if (typeof tool_version_url !== 'undefined') { %>
			<a href="<%= tool_version_url %>" target="_blank"><b class="version"><%= tool.version_string %></b></a>
			<% } else { %>
			<b class="version"><%= tool.version_string %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Platform</label>
		<div class="controls">

			<% if (typeof platform !== 'undefined') { %>
			<% if (typeof platform_url !== 'undefined') { %>
			<a href="<%= platform_url %>" target="_blank"><%= platform.name %></a>
			<% } else { %>
			<%= platform_name %>
			<% } %>
			<% } %>

			<% if (typeof platform !== 'undefined') { %>
			<b>version</b>
			<% if (typeof platform_version_url !== 'undefined') { %>
			<a href="<%= platform_version_url %>" target="_blank"><b class="version"><%= platform.version_string %></b></a>
			<% } else { %>
			<b class="version"><%= platform.version_string %></b>
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

	<button id="filter" class="btn btn-primary" style="float:right"><i class="fa fa-filter"></i>Filter</button>
</ul>

<div class="tab-content">
	<div id="list-panel" role="tabpanel" class="tab-pane active">
		<div class="weakness-list"></div>

		<label>
			<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
			Show numbering
		</label>

		<label>
			<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
			Show grouping
		</label>

		<div class="nav-button-bar"></div>
	</div>

	<div id="tree-panel" role="tabpanel" class="tab-pane">
		<div class="source-tree"></div>
	</div>
</div>