<h1>
	<div class="icon"><i class="fa fa-bus"></i></div>
	<% if (model.isTrialProject()) { %>
	Schedule Assessment Runs
	<% } else { %>
	Schedule <span class="name"><%- full_name %></span> Assessment Runs
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<% if (model) { %>
	<% if (model.isTrialProject()) { %>
	<li><a href="#assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<% } else { %>
	<li><a href="#assessments?project=<%- model.get('project_uid') %>"><i class="fa fa-check"></i><%- model.get('full_name') %> Assessments</a></li>
	<% } %>
	<% } else { %>
	<li><a href="#assessments?project=all"><i class="fa fa-bus"></i>All Assessments</a></li>
	<% } %>

	<% if (model.isTrialProject()) { %>
	<li><i class="fa fa-bus"></i>Schedule Assessment Runs</li>
	<% } else { %>
	<li><i class="fa fa-bus"></i>Schedule <span class="name"><%- full_name %></span> Assessment Runs</li>
	<% } %>
</ol>

<p>Select a schedule for when to execute your <%- numberOfAssessments %> assessment runs: </p>

<div class="top buttons">
	<button id="add-new-schedule" class="btn"><i class="fa fa-plus"></i>Add New Schedule</button>
</div>

<div id="select-schedules-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading schedules...</div>
</div>

<% if (config['email_enabled']) { %>
<br />
<div class="well">
	<label class="checkbox-inline">
		<input type="checkbox" name="notify" id="notify" />
		Notify me via email when these assessment runs are completed.
	</label>
</div>
<% } %>

<div class="bottom buttons">
	<button id="schedule-assessments" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Schedule Assessments</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
