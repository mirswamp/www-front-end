<h1>
	<div class="icon"><i class="fa fa-check"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-check"></i><span id="breadcrumb">Assessments</span></li>
</ol>

<% if (showNavigation) { %>
<ul class="well nav nav-pills">
	<li><a id="results"><i class="fa fa-bug"></i>Results</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>
<% } %>

<p>Assessments are triplets of package, tool, and platform identifiers that together specify an assessment to be run.  To run or schedule an assessment, select one or more assessments from the list below or add a new assessment. </p>

<div id="assessment-filters"></div>

<div class="top buttons">
	<button id="run-assessments" class="btn btn-primary" disabled><i class="fa fa-play"></i>Run Assessments</button>
	<button id="run-new-assessment" class="btn"><i class="fa fa-plus"></i>Add New Assessment</button>
</div>

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
	<button id="delete-assessments" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Assessments</button>
</div>


