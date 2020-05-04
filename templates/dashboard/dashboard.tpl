<% if (user.has('penultimate_login_date')) { %>
<div id="last-login" class="hidden-xxs">
	<span class="fineprint">You last signed in on <%= datetimeToHTML(user.get('penultimate_login_date')) %></span>
</div>
<% } %>

<div class="banner">
	<img id="logo" class="img-responsive hidden-xxs" src="images/logos/swamp-logo-large.png" alt="logo" />
	<div class="visible-xxs" align="center">
		<img id="icon" class="img-responsive" src="images/logos/swamp-icon-large.png" alt="icon" />				
	</div>
	<div class="tagline">Do It Early. Do It Often.</div>
</div>

<br />

<div class="nav row">
	<a href="#packages" class="column" id="packages">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-gift"></i></div>
		</div>
		<div class="info">
			<h2>Packages</h2>
			<p class="description">
				Upload your code and manage your software packages.
			</p>
		</div>
	</a>

	<a href="#tools" class="column" id="tools" style="display:none">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-wrench"></i></div>
		</div>
		<div class="info">
			<h2>Tools</h2>
			<p class="description">Manage your software assessment tools.</p>
		</div>
	</a>

	<a href="#assessments" class="column" id="assessments">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-check"></i></div>
		</div>
		<div class="info">
			<h2>Assessments</h2>
			<p class="description">Perform assessments on packages using code analysis tools.</p>
		</div>
	</a>

	<a href="#results" class="column" id="results">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-bug"></i></div>
		</div>
		<div class="info">
			<h2>Results</h2>
			<p class="description">View the status and results of completed assessments.</p>
		</div>
	</a>

	<a href="#projects" class="column" id="projects">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-folder-open"></i></div>
		</div>
		<div class="info">
			<h2>Projects</h2>
			<p class="description">Create projects to share results with other users.</p>
		</div>
	</a>

	<a href="#run-requests/schedules" class="column" id="schedules">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-calendar"></i></div>
		</div>
		<div class="info">
			<h2>Schedules</h2>
			<p class="description">Create schedules to run assessments on a recurring basis.</p>
		</div>
	</a>

	<a href="#run-requests" class="column" id="runs">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-bus"></i></div>
			
		</div>
		<div class="info">
			<h2>Scheduled Runs</h2>
			<p class="description">View assessments scheduled to run at regular intervals.</p>
		</div>
	</a>

	<a href="#events?project=any" class="column" id="events" style="display:none">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-bullhorn"></i></div>
		</div>
		<div class="info">
			<h2>Events</h2>
			<p class="description">View events associated with your projects & account.</p>
		</div>
	</a>

	<% if (isAdmin) { %>
	<a href="#settings" class="column" id="settings">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-gears"></i></div>
		</div>
		<div class="info">
			<h2>Settings</h2>
			<p class="description">Review and modify SWAMP system wide settings.</p>
		</div>
	</a>

	<a href="#overview" class="column" id="overview">
		<div class="icon-group">
			<div class="icon"><i class="fa fa-eye"></i></div>
		</div>
		<div class="info">
			<h2>Overview</h2>
			<p class="description">Monitor SWAMP system wide activity.</p>
		</div>
	</a>
	<% } %>
</div>