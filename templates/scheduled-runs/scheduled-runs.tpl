<h1>
	<div class="icon"><i class="fa fa-bus"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-bus"></i><span id="breadcrumb"><%= shortTitle %></span></li>
</ol>

<% if (showNavigation) { %>
<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="results"><i class="fa fa-bug"></i>Results</a></li>
</ul>
<% } %>

<p>Assessment runs may be defined to occur on a recurring basis according to a schedule. Scheduled assessment runs will continue to periodically run as long as they exist so any unused runs should be deleted from this list.</p>

<div id="scheduled-runs-filters"></div>
<br />

<div class="top buttons">
	<button id="add-new-scheduled-runs" class="btn"><i class="fa fa-plus"></i>Add New Scheduled Runs</button>
</div>

<div id="scheduled-runs-lists">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading runs...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="show-schedules" class="btn btn-primary btn-lg"><i class="fa fa-calendar"></i>Show Schedules</button>
</div>