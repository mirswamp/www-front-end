<h1>
	<div class="icon"><i class="fa fa-warning"></i></div>
	<span id="title">Warning Report</span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-warning"></i><span id="breadcrumb">Warning Report</span></li>
</ol>

<h2>Assessment Summary</h2>
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

	<% if (typeof assessment_start_ts !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Assessment Start Time</label>
		<div class="controls">
			<%= assessment_start_ts %>
		</div>
	</div>
	<% } %>

	<% if (typeof assessment_end_ts !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Assessment End Time</label>
		<div class="controls">
			<%= assessment_end_ts %>
		</div>
	</div>
	<% } %>

</div>

<h2>Links</h2>
<div class="well">
	<ul>
		<li><a href="https:documentation/swamp_output_and_debugging.pdf" target="_blank">Status.out and Debugging Failures FAQ (PDF)</a></li>
		<li><a href="https:documentation/swamp_output_and_debugging.html" target="_blank">Status.out and Debugging Failures FAQ (HTML)</a></li>
	</ul>
</div>

<h2>Warning Information</h2>
<div id="error-info" class="form-horizontal well" style="word-break:break-word">

	<% if (typeof report_generation_ts !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Report Generation Time</label>
		<div class="controls">
			<%= report_generation_ts %>
		</div>
	</div>
	<% } %>

	<% if (typeof status !== 'undefined') { %>
	<% for (var i = 0; i < status.length; i++) { %>
	<% var attribute = status[i]; %>
	<% if (attribute.content) { %>
	<% if (typeof attribute.collapsed !== 'undefined') { %>

	<div class="form-group" id="collapsable-group<%= i %>">

		<% if (typeof attribute.anchor !== 'undefined') { %>
        		<label class="form-label">Warning <a href="https:documentation/swamp_output_and_debugging.html#<%= attribute.anchor %>" target="_blank"><%= attribute.name %></a>
		<% } else { %>
        		<label class="form-label"><%= attribute.name %>
		<% } %>

		<a data-toggle="collapse" data-target="#collapsable-group<%= i %> .collapse" data-parent="#collapsable-group<%= i %>">
			<% if (attribute.collapsed) { %>
			<i class="fa fa-plus-circle" style="float:right; margin-top:5px; margin-right:-15px"></i>
			<% } else { %>
			<i class="fa fa-minus-circle" style="float:right; margin-top:5px; margin-right:-15px"></i>
			<% } %>
		</a>
		</label>

		<div class="collapse<% if (!attribute.collapsed) { %> in<% } %>">
			<% if (attribute.content.content) { %>
			<pre><%= attribute.content.content %></pre>
			<% } else if (typeof attribute.content == 'string') { %>
			<pre><%= attribute.content %></pre>
			<% } else { %>
			<div class="pre code">

			<% if (Array.isArray(attribute.content)) { %>

			<ol>
			<% for (var j = 0; j < attribute.content.length; j++) { %>
			<% var value2 = attribute.content[j]; %>
			<li>
			<% if (typeof value2 == 'string') { %>
			<%= value2 %>
			<% } else { %>
			<ol>
			<% var keys3 = Object.keys(value2); %>
			<% for (var k = 0; k < keys3.length; k++) { %>
			<li><%= value2[keys3[k]] %></li>
			<% } %>
			</ol>
			<% } %>
			</li>
			<% } %>
			</ol>

			<% } else { %>

			<ul>
			<% var keys2 = Object.keys(attribute.content); %>
			<% for (var j = 0; j < keys2.length; j++) { %>
			<% var key2 = keys2[j]; %>
			<% var value2 = attribute.content[key2]; %>
			<li><%= key2 %>:
			<% if (typeof value2 == 'string') { %>
			<%= value2 %>
			<% } else { %>
			<ol>
			<% var keys3 = Object.keys(value2); %>
			<% for (var k = 0; k < keys3.length; k++) { %>
			<li><%= value2[keys3[k]] %></li>
			<% } %>
			</ol>
			<% } %>
			</li>
			<% } %>
			</ul>

			<% } %>
			</div>
			<% } %>
		</div>
	</div>

	<% } else { %>
	<div class="form-group">
		<label class="form-label"><%= attribute.name %></label>
		<% if (attribute.content.content) { %>
		<pre><%= attribute.content.content %></pre>
		<% } else if (typeof attribute.content == 'string') { %>
		<pre><%= attribute.content %></pre>
		<% } else { %>
		<div class="pre code">

		<% if (Array.isArray(attribute.content)) { %>

		<ol>
		<% for (var j = 0; j < attribute.content.length; j++) { %>
		<% var value2 = attribute.content[j]; %>
		<li>
		<% if (typeof value2 == 'string') { %>
		<%= value2 %>
		<% } else { %>
		<ol>
		<% var keys3 = Object.keys(value2); %>
		<% for (var k = 0; k < keys3.length; k++) { %>
		<li><%= value2[keys3[k]] %></li>
		<% } %>
		</ol>
		<% } %>
		</li>
		<% } %>
		</ol>

		<% } else { %>

		<ul>
		<% var keys2 = Object.keys(attribute.content); %>
		<% for (var j = 0; j < keys2.length; j++) { %>
		<% var key2 = keys2[j]; %>
		<% var value2 = attribute.content[key2]; %>
		<li><%= key2 %>:
		<% if (typeof value2 == 'string') { %>
		<%= value2 %>
		<% } else { %>
		<ol>
		<% var keys3 = Object.keys(value2); %>
		<% for (var k = 0; k < keys3.length; k++) { %>
		<li><%= value2[keys3[k]] %></li>
		<% } %>
		</ol>
		<% } %>
		</li>
		<% } %>
		</ul>

		<% } %>
		</div>
		<% } %>
	</div>
	<% } %>
	<% } %>
	<% } %>
	<% } %>
</div>
