<div class="small sidebar well">
	<%
	function opposite(side) {
		if (side == 'right') {
			return 'left';
		} else {
			return 'right';
		}
	}
	%>

	<a href="#packages">
		<div class="active tile well<% if (nav == 'packages') { %> selected<% } %>" id="packages" data-placement="<%- opposite(orientation) %>" data-content="Packages" data-container="body">
			<i class="fa fa-gift"></i>
		</div>
	</a>

	<a href="#tools">
		<div class="active tile well<% if (nav == 'tools') { %> selected<% } %>" id="tools" style="display:none" data-placement="<%- opposite(orientation) %>" data-content="Tools" data-container="body">
			<i class="fa fa-wrench"></i>
		</div>
	</a>

	<a href="#assessments">
		<div class="active tile well<% if (nav == 'assessments') { %> selected<% } %>" id="assessments" data-placement="<%- opposite(orientation) %>" data-content="Assessments" data-container="body">
			<i class="fa fa-check"></i>
		</div>
	</a>

	<a href="#results">
		<div class="active tile well<% if (nav == 'results') { %> selected<% } %>" id="results" data-placement="<%- opposite(orientation) %>" data-content="Assessment Results" data-container="body">
			<i class="fa fa-bug"></i>
		</div>
	</a>

	<a href="#projects">
		<div class="active tile well<% if (nav == 'projects') { %> selected<% } %>" id="projects" data-placement="<%- opposite(orientation) %>" data-content="Projects" data-container="body">
			<i class="fa fa-folder-open"></i>
		</div>
	</a>

	<a href="#run-requests/schedules">
		<div class="active tile well<% if (nav == 'schedules') { %> selected<% } %>" id="schedules" data-placement="<%- opposite(orientation) %>" data-content="Schedules" data-container="body">
			<i class="fa fa-calendar"></i>
		</div>
	</a>

	<a href="#run-requests">
		<div class="active tile well<% if (nav == 'runs') { %> selected<% } %>" id="runs" data-placement="<%- opposite(orientation) %>" data-content="Scheduled Runs" data-container="body">
			<i class="fa fa-bus"></i>
		</div>
	</a>

	<a href="#events?project=any" style="display:none">
		<div class="active tile well<% if (nav == 'events') { %> selected<% } %>" id="events" data-placement="<%- opposite(orientation) %>" data-content="Events" data-container="body">
			<i class="fa fa-bullhorn"></i>
		</div>
	</a>

	<% if (isAdmin) { %>
	<a href="#settings">
		<div class="active tile well<% if (nav == 'settings') { %> selected<% } %>" id="settings" data-placement="<%- opposite(orientation) %>" data-content="System Settings" data-container="body">
			<i class="fa fa-gears"></i>
		</div>
	</a>

	<a href="#overview">
		<div class="active tile well<% if (nav == 'overview') { %> selected<% } %>" id="overview" data-placement="<%- opposite(orientation) %>" data-content="System Overview" data-container="body">
			<i class="fa fa-eye"></i>
		</div>
	</a>
	<% } %>

	<div class="tile well">
		<% if (typeof orientation !== 'undefined' && orientation == 'left') { %>
		<div class="icons" align="center">
			<i id="top-nav" class="active fa fa-toggle-up" data-placement="right" data-content="Switch to top navigation bar" data-container="body"></i>
			<i id="right-nav" class="active fa fa-toggle-right" data-placement="right" data-content="Switch to right navigation bar" data-container="body"></i>
			<i id="bottom-nav" class="active fa fa-toggle-down" data-placement="right" data-content="Switch to bottom navigation bar" data-container="body" style="display:none"></i>
		</div>
		<% } else { %>
		<div class="icons" align="center">
			<i id="left-nav" class="active fa fa-toggle-left" data-placement="left" data-content="Switch to left navigation bar" data-container="body"></i>
			<i id="top-nav" class="active fa fa-toggle-up" data-placement="left" data-content="Switch to top navigation bar" data-container="body"></i>
			<i id="bottom-nav" class="active fa fa-toggle-down" data-placement="left" data-content="Switch to bottom navigation bar" data-container="body" style="display:none"></i>
		</div>
		<% } %>
	</div>
</div>