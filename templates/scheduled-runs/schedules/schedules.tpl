<h1>
	<div class="icon"><i class="fa fa-calendar"></i></div>
	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	Run Request Schedules
	<% } else { %>
	<span class="name"><%- project.get('full_name') %></span> Run Request Schedules
	<% } %>
	<% } else { %>
	All Run Request Schedules
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	<li><a href="#run-requests?project=none"><i class="fa fa-bus"></i>Scheduled Runs</a></li>
	<% } else { %>
	<li><a href="#run-requests?project=<%- project.get('project_uid') %>"><i class="fa fa-bus"></i><%- project.get('full_name') %> Scheduled Runs</a></li>
	<% } %>
	<% } else { %>
	<li><a href="#run-requests"><i class="fa fa-bus"></i>All Scheduled Runs</a></li>
	<% } %>

	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	<li><i class="fa fa-calendar"></i>Schedules</li>
	<% } else { %>
	<li><i class="fa fa-calendar"></i><%- project.get('full_name') %> Schedules</li>
	<% } %>
	<% } else { %>
	<li><i class="fa fa-calendar"></i>All Schedules</li>
	<% } %>
</ol>

<div id="schedule-filters"></div>
<br />

<div class="top buttons">
	<button id="add-new-schedule" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Schedule</button>
</div>

<div id="schedules-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading schedules...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
