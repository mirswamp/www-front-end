<h1>
	<div class="icon"><i class="fa fa-bus"></i></div>
	<% if (isTrialProject) { %>
	Schedule Assessment Runs
	<% } else { %>
	Schedule <span class="name"><%- full_name %></span> Assessment Runs
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#run-requests"><i class="fa fa-bus"></i><span id="breadcrumb">Scheduled Runs</span></a></li>
	<li><a href="#run-requests/add"><i class="fa fa-check"></i><span id="breadcrumb">Add New Scheduled Runs</span></a></li>
	<li><i class="fa fa-check"></i><span id="breadcrumb">Schedule Runs</span></li>
</ol>

<p>Select a schedule for when to execute your <%= numberOfAssessments > 1? numberOfAssessments + ' assessment runs' : 'assessment run' %>: </p>

<div class="top buttons">
	<button id="add-new-schedule" class="btn"><i class="fa fa-plus"></i>Add New Schedule</button>
</div>

<div id="select-schedules-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading schedules...</div>
	</div>
</div>

<% if (application.config.email_enabled) { %>
<br />
<div class="well">
	<label class="checkbox-inline">
		<input type="checkbox" name="notify" id="notify" />
		Notify me via email when these assessment runs are completed.
	</label>
</div>
<% } %>

<div class="bottom buttons">
	<button id="schedule-assessments" class="btn btn-primary btn-lg"><i class="fa fa-calendar"></i>Schedule Assessments</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
