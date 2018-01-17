<div class="large sidebar well">
	<% if (showHome) { %>
	<a href="#home">
		<div class="active tile well<% if (nav == 'home') { %> selected<% } %>" id="home">
			<div align="center">
				<i class="fa fa-home fa-3x"></i>
				<div><label>Home</label></div>
			</div>
		</div>
	</a>
	<% } %>

	<a href="#packages">
		<div class="active tile well<% if (nav == 'packages') { %> selected<% } %>" id="packages">
			<div align="center">
				<i class="fa fa-gift fa-3x"></i>
				<div><label>Packages</label></div>
			</div>
		</div>
	</a>

	<a href="#tools">
		<div class="active tile well<% if (nav == 'tools') { %> selected<% } %>" id="tools">
			<div align="center">
				<i class="fa fa-wrench fa-3x"></i>
				<div><label>Tools</label></div>
			</div>
		</div>
	</a>

	<a href="#assessments">
		<div class="active tile well<% if (nav == 'assessments') { %> selected<% } %>" id="assessments">
			<div align="center">
				<i class="fa fa-check fa-3x"></i>
				<div><label>Assessments</label></div>
			</div>
		</div>
	</a>

	<a href="#results">
		<div class="active tile well<% if (nav == 'results') { %> selected<% } %>" id="results">
			<div align="center">
				<i class="fa fa-bug fa-3x"></i>
				<div><label>Results</label></div>
			</div>
		</div>
	</a>

	<a href="#run-requests">
		<div class="active tile well<% if (nav == 'runs') { %> selected<% } %>" id="runs">
			<div align="center">
				<i class="fa fa-bus fa-3x"></i>
				<div><label>Runs</label></div>
			</div>
		</div>
	</a>

	<a href="#projects">
		<div class="active tile well<% if (nav == 'projects') { %> selected<% } %>" id="projects">
			<div align="center">
				<i class="fa fa-folder-open fa-3x"></i>
				<div><label>Projects</label></div>
			</div>
		</div>
	</a>

	<a href="#events?project=any">
		<div class="active tile well<% if (nav == 'events') { %> selected<% } %>" id="events">
			<div align="center">
				<i class="fa fa-bullhorn fa-3x"></i>
				<div><label>Events</label></div>
			</div>
		</div>
	</a>

	<% if (isAdmin) { %>
	<a href="#settings">
		<div class="active tile well<% if (nav == 'settings') { %> selected<% } %>" id="settings">
			<div align="center">
				<i class="fa fa-gears fa-3x"></i>
				<div><label>Settings</label></div>
			</div>
		</div>
	</a>

	<a href="#overview">
		<div class="active tile well<% if (nav == 'overview') { %> selected<% } %>" id="overview">
			<div align="center">
				<i class="fa fa-eye fa-3x"></i>
				<div><label>Overview</label></div>
			</div>
		</div>
	</a>
	<% } %>

	<div class="tile well last">
		<% if (orientation == 'left') { %>
		<div class="row icons" align="center">
			<i id="minimize-nav" class="active fa fa-search-minus" data-placement="right" data-content="Minimize navigation bar." data-container="body"></i>
			<i id="top-nav" class="active fa fa-toggle-up" data-placement="right" data-content="Switch to top navigation bar." data-container="body"></i>
			<i id="bottom-nav" class="active fa fa-toggle-down" data-placement="right" data-content="Switch to bottom navigation bar." data-container="body" style="display:none"></i>
			<i id="right-nav" class="active fa fa-toggle-right" data-placement="right" data-content="Switch to right navigation bar." data-container="body"></i>
		</div>
		<% } else { %>
		<div class="row icons" align="center">
			<i id="left-nav" class="active fa fa-toggle-left" data-placement="left" data-content="Switch to left navigation bar." data-container="body"></i>
			<i id="top-nav" class="active fa fa-toggle-up" data-placement="left" data-content="Switch to top navigation bar." data-container="body"></i>
			<i id="bottom-nav" class="active fa fa-toggle-down" data-placement="left" data-content="Switch to bottom navigation bar." data-container="body" style="display:none"></i>
			<i id="minimize-nav" class="active fa fa-search-minus" data-placement="left" data-content="Minimize navigation bar." data-container="body"></i>
		</div>
		<% } %>
	</div>
</div>


