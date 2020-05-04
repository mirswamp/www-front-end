<h1>
	<div class="icon"><i class="fa fa-plus"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#run-requests<%= queryString? '?' + queryString : '' %>"><i class="fa fa-bus"></i><span id="breadcrumb">Scheduled Runs</span></a></li>
	<li><i class="fa fa-check"></i><span id="breadcrumb">Add Scheduled Runs</span></li>
</ol>

<% if (showNavigation) { %>
<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="schedules"><i class="fa fa-calendar"></i>Schedules</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>
<% } %>

<p>To add a new scheduled assessment run, select one or more assessments from the list below and then click the Schedule Assessments button to select a schedule for when to run the selected assessments. </p>

<div id="assessment-filters"></div>

<div class="top buttons">
	<button id="schedule-assessments" class="btn btn-primary" disabled><i class="fa fa-calendar"></i>Schedule Assessments</button>
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
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>