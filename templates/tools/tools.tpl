<h1>
	<div class="icon"><i class="fa fa-wrench"></i></div>
	Tools
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<li><i class="fa fa-wrench"></i>
	Tools
	</li>
</ol>

<p>Tools are sofware programs that allow a user to perform assessments on software code to find potential weaknesses and vulnerabilities.  Tools may have multiple versions. </p>

<div id="tool-filters"></div>
<br />

<div id="tools-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading tools...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>