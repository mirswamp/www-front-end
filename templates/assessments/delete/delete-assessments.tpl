<h1>
	<div class="icon"><i class="fa fa-check"></i></div>
	Delete <span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-trash"></i>Delete <span id="breadcrumb">Delete Assessments</span></li>
</ol>

<p>To delete assessments, select one or more assessments from the list below and click the delete button or delete them individually using the buttons to the right of each row. </p>

<div id="assessment-filters"></div>
<br />

<div id="select-assessments-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading assessments...</div>
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
	<button id="delete" class="btn btn-primary btn-lg" disabled><i class="fa fa-trash"></i>Delete Selected</button>
	<button id="done" class="btn btn-lg"><i class="fa fa-stop"></i>Done</button>
</div>


