<h1>
	<div class="icon"><i class="fa fa-bus"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-bus"></i><span id="breadcrumb">Scheduled Runs</span></li>
</ol>

<% if (showNavigation) { %>
<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="schedules"><i class="fa fa-calendar"></i>Schedules</a></li>
</ul>
<% } %>

<p>Assessment runs may be defined to occur on a recurring basis according to a schedule. Scheduled assessment runs will continue to periodically run as long as they exist so any unused runs should be deleted from this list.</p>

<div id="scheduled-runs-filters"></div>

<div class="top buttons">
	<button id="add-new-scheduled-runs" class="btn"><i class="fa fa-plus"></i>Add New Scheduled Runs</button>
</div>

<div id="scheduled-runs-lists">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading runs...</div>
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