<h1><div class="icon"><i class="fa fa-wrench"></i></div><span class="name"><%- name %></span> Tool Version <span class="name"><%- version_string %></span></h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><a href="#tools/public"><i class="fa fa-wrench"></i>Tools</a></li>
	<li><a href="#tools/<%- tool.get('tool_uuid') %>"><i class="fa fa-wrench"></i><%- name %></a></li>
	<li><i class="fa fa-wrench"></i>Tool Version <%- version_string %></li>
</ol>

<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="results"><i class="fa fa-bug"></i>Results</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>

<div class="well">
	<div id="tool-version-profile"></div>
</div>

<div class="bottom buttons">
	<button id="run-new-assessment" class="btn btn-primary btn-lg"><i class="fa fa-play"></i>Run New Assessment</button>
	<% if (showNavigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<% } %>
</div>