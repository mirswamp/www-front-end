<h1><div class="icon"><i class="fa fa-bars"></i></div><span class="name"><%- name %></span> Platform version <span class="name"><%- version_string %></span></h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><a href="#platforms/public"><i class="fa fa-bars"></i>Platforms</a></li>
	<li><a href="#platforms/<%- platform.get('platform_uuid') %>"><i class="fa fa-bars"></i><%- name %></a></li>
	<li><i class="fa fa-bars"></i>Platform version <%- version_string %></li>
</ol>

<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="results"><i class="fa fa-bug"></i>Results</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>

<div class="well">
	<div id="platform-version-profile"></div>
</div>

<div class="bottom buttons">
	<button id="run-new-assessment" class="btn btn-primary btn-lg"><i class="fa fa-play"></i>Run New Assessment</button>
	<% if (showNavigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<% } %>
</div>