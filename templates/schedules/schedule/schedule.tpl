<h1>
	<div class="icon"><i class="fa fa-calendar"></i></div>
	<span class="name"><%- name %></span> Schedule
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<% if (project) { %>
	<% if (project.isTrialProject()) { %>
	<li><a href="#run-requests/schedules"><i class="fa fa-calendar"></i>Schedules</a></li>
	<% } else { %>
	<li><a href="#run-requests/schedules?project=<%- project.get('project_uid') %>"><i class="fa fa-calendar"></i><%- project.get('full_name') %> Schedules</a></li>
	<% } %>
	<% } else { %>
	<li><a href="#schedules?project=all"><i class="fa fa-calendar"></i>All Schedules</a></li>
	<% } %>

	<li><i class="fa fa-calendar"></i><%- name %> Schedule</li>
</ol>

<div class="well">
	<div id="schedule-profile"></div>
</div>

<h2>Run Requests</h2>
<div id="schedule-items-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading schedule items...</div>
	</div>
</div>

<% if (editable) { %>
<div class="bottom buttons">
	<button id="edit" class="btn btn-lg"><i class="fa fa-pencil"></i>Edit Schedule</button>
</div>
<% } %>