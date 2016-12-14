<h1><div class="icon"><i class="fa fa-wrench"></i></div><span class="name"><%- name %></span> Tool</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><a href="#tools/public"><i class="fa fa-wrench"></i>Tools</a></li>
	<li><i class="fa fa-wrench"></i><%- name %></li>
</ol>

<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="results"><i class="fa fa-bug"></i>Results</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>

<% if (showSharing) { %>
<ul class="nav nav-tabs">
	<li id="details"<% if (nav == 'details') { %> class="active" <% } %>>
		<a><i class="fa fa-search"></i>Details</a>
	</li>

	<li id="sharing"<% if (nav == 'sharing') { %> class="active" <% } %>>
		<a><i class="fa fa-share-alt"></i>Sharing</a>
	</li>
</ul>
<% } %>

<div id="tool-info"></div>