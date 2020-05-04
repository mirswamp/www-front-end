<h1>
	<div class="icon"><i class="fa fa-gift"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-check"></i><span id="breadcrumb">Packages</span></li>
</ol>

<p>Packages are collections of files containing code to be assessed along with information about how to build the software package, if necessary.  Packages may be written in a variety of programming languages and may have multiple versions. </p>

<div id="package-filters"></div>

<div class="top buttons">
	<button id="add-new-package" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Package</button>
</div>

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