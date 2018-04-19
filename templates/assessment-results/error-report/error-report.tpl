<h1>
	<div class="icon"><i class="fa fa-bug"></i></div>
	<span id="title">Error Report</span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-bug"></i><span id="breadcrumb">Error Report</span></li>
</ol>

<h2>Assessment Summary</h2>
<div id="assessment-profile" class="form-horizontal well">

	<div class="form-group">
		<label class="form-label">Package</label>
		<div class="controls">

			<% if (typeof package_name != 'undefined') { %>
			<% if (package_url) { %>
			<a href="<%= package_url %>"><%= package_name %></a>
			<% } else { %>
			<%= package_name %>
			<% } %>
			<% } %>

			<% if (typeof package_version != 'undefined') { %>
			<b>version</b>
			<% if (typeof package_version_url != 'undefined') { %>
			<a href="<%= package_version_url %>"><b class="version"><%= package_version %></b></a>
			<% } else { %>
			<b class="version"><%= package_version %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Tool</label>
		<div class="controls">

			<% if (typeof tool_name != 'undefined') { %>
			<% if (typeof tool_url != 'undefined') { %>
			<a href="<%= tool_url %>"><%= tool_name %></a>
			<% } else { %>
			<%= tool_name %>
			<% } %>
			<% } %>

			<% if (typeof tool_version != 'undefined') { %>
			<b>version</b>
			<% if (typeof tool_version_url != 'undefined') { %>
			<a href="<%= tool_version_url %>"><b class="version"><%= tool_version %></b></a>
			<% } else { %>
			<b class="version"><%= tool_version %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Platform</label>
		<div class="controls">

			<% if (typeof platform_name != 'undefined') { %>
			<% if (typeof platform_url != 'undefined') { %>
			<a href="<%= platform_url %>"><%= platform_name %></a>
			<% } else { %>
			<%= platform_name %>
			<% } %>
			<% } %>

			<% if (typeof platform_version != 'undefined') { %>
			<b>version</b>
			<% if (typeof platform_version_url != 'undefined') { %>
			<a href="<%= platform_version_url %>"><b class="version"><%= platform_version %></b></a>
			<% } else { %>
			<b class="version"><%= platform_version %></b>
			<% } %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Assessment Time</label>
		<div class="controls">
			<% if (typeof assessment_start_ts != 'undefined') { %>
			<%= assessment_start_ts %>
			<% } %>
			<% if (typeof assessment_end_ts != 'undefined') { %>
			to <%= assessment_end_ts %>
			<% } %>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Assessment Info</label>
		<div class="controls">
			<% if (typeof version_information != 'undefined') { %>
			<%= version_information %>
			<% } %>
		</div>
	</div>
</div>

<h2>Links</h2>
<div class="well">
	<ul>
		<li><a href="https://www.swampinabox.org/doc/statusout.pdf" target="_blank">Status.out and Debugging SWAMP Failures FAQ (PDF)</a></li>
		<% if (typeof url != 'undefined' && url && url != '') { %>
		<li><a href="<%= url %>" target="_blank">Download all failed results as a single file</a></li>
		<% } %>
	</ul>
</div>

<h2>Error Information</h2>
<div id="error-info" class="form-horizontal well" style="word-break:break-word">

	<% if (typeof report_generation_ts != 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Report Generation Time</label>
		<div class="controls">
			<%= report_generation_ts %>
		</div>
	</div>
	<% } %>

	<% if (typeof error_message != 'undefined') { %>
	<div class="form-group">
		<% if (typeof error_message == 'string') { %>
		<%= error_message %>
		<% } else if (error_message.length > 0) { %>
		<% for (var i = 0; i < error_message.length; i++) { %>
		<% var error = error_message[i]; %>
		<label class="form-label"><%= error[0].toTitleCase() %></label>
		<pre class="form-controls"><%= error[1] %></pre>
		<% } %>
		<% } %>
	</div>
	<% } %>

	<% if (typeof status_out != 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Contents of status.out</label>
		<pre><%= status_out %></pre>
	</div>
	<% } %>

	<% if (typeof stderr != 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Contents of stderr</label>
		<pre><%= stderr %></pre>
	</div>
	<% } %>

	<% if (typeof stdout != 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Contents of stdout</label>
		<pre><%= stdout %></pre>
	</div>
	<% } %>
</div>
