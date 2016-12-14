<h1>
	<div class="icon"><i class="fa fa-gift"></i></div>
	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	My
	<% } else { %>
	Project <span class="name"><%- project.get('short_name') %></span>
	<% } %>
	<% } %>

	<% if (packageType) { %>
	<span class="name"><%- packageType %></span>
	<% } %>
	Packages
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<li><i class="fa fa-gift"></i>
	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	My
	<% } else { %>
	Project <span class="name"><%- project.get('short_name') %></span>
	<% } %>
	<% } %>
	<% if (packageType) { %>
	<%- packageType %>
	<% } %>
	Packages
	</li>
</ol>

<p>Packages are collections of files containing code to be assessed along with information about how to build the software package, if necessary.  Packages may be written in a variety of programming languages and may have multiple versions. </p>

<div id="package-filters"></div>
<br />

<div class="top buttons">
	<button id="add-new-package" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Package</button>
</div>

<div id="packages-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading packages...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>
