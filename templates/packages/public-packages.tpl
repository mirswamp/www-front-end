<h1><div class="icon"><i class="fa fa-gift"></i></div>Packages</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><i class="fa fa-gift"></i>Packages</li>
</ol>

<p>Packages are collections of files containing code to be assessed along with information about how to build the software package, if necessary.  Packages may be written in a variety of programming languages and may have multiple versions. </p>

<div id="package-filters"></div>
<br />

<p>The following curated packages <span id="filter-description"></span> are available to all users.  <% if (!loggedIn) { %>To see more detailed information about each of the packages listed in this view, log in to the application. <% } %></p>

<div id="packages-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading packages...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>