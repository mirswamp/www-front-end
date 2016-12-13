<div class="well">
	<%
	function opposite(side) {
		if (side == 'top') {
			return 'bottom';
		} else {
			return 'top';
		}
	}
	%>

	<% if (showChangeIcons) { %>
	<div class="icons hidden-xxs">
		<i id="side-nav" class="active fa fa-toggle-left pull-right" data-placement="<%- opposite(orientation) %>" data-content="Switch to side navigation bar" data-container="body"></i>
	</div>
	<% } %>
	<ul class="nav nav-pills nav-justified">
		<% if (showHome) { %>
		<li<% if (nav == 'home') {%> class="active" <% } %>>
			<a id="home" href="#"><i class="fa fa-home"></i>Home</a>
		</li>
		<% } %>

		<li<% if (nav == 'packages') {%> class="active" <% } %>>
			<a id="packages"><i class="fa fa-gift"></i><label class="hidden-xxs">Packages</label></a>
		</li>

		<li<% if (nav == 'tools') {%> class="active" <% } %> style="display:none">
			<a id="tools"><i class="fa fa-wrench"></i><label class="hidden-xxs">Tools</label></a>
		</li>

		<li<% if (nav == 'assessments') {%> class="active" <% } %>>
			<a id="assessments"><i class="fa fa-check"></i><label class="hidden-xxs">Assessments</label></a>
		</li>
		<li<% if (nav == 'results') {%> class="active" <% } %>>
			<a id="results"><i class="fa fa-bug"></i><label class="hidden-xxs">Results</label></a></li>
		<li<% if (nav == 'runs') {%> class="active" <% } %>>
			<a id="runs"><i class="fa fa-bus"></i><label class="hidden-xxs">Runs</label></a>
		</li>
		
		<li<% if (nav == 'projects') {%> class="active" <% } %>>
			<a id="projects"><i class="fa fa-folder-open"></i><label class="hidden-xxs">Projects</label></a>
		</li>
		<li<% if (nav == 'events') {%> class="active" <% } %>>
			<a id="events"><i class="fa fa-bullhorn"></i><label class="hidden-xxs">Events</label></a>
		</li>
		
		<% if (isAdmin) { %>
		<li<% if (nav == 'settings') {%> class="active" <% } %>>
			<a id="settings"><i class="fa fa-gears"></i><label class="hidden-xxs">Settings</label></a>
		</li>
		<li<% if (nav == 'overview') {%> class="active" <% } %>>
			<a id="overview"><i class="fa fa-eye"></i><label class="hidden-xxs">Overview</label></a>
		</li>
		<% } %>
	</ul>
</div>
