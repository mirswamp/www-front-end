<h1>
	<div class="icon"><i class="fa fa-trash"></i></div>
	Delete <span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-trash"></i>Delete <span id="breadcrumb">Delete Assessment Results</span></li>
</ol>

<p>To delete assessment results, select one or more results from the list below and click the delete button or delete them individually using the buttons to the right of each row.</p>

<div id="assessment-runs-filters"></div>
<br />

<div id="assessment-runs-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading assessment runs...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<label>
	<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
	Show grouping
</label>

<div class="bottom buttons">
	<button id="delete" class="btn btn-primary btn-lg"><i class="fa fa-trash"></i>Delete Selected Results</button>
	<button id="done" class="btn btn-lg"><i class="fa fa-stop"></i>Done</button>
</div>