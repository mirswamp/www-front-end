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
			<a href="#home"><i class="fa fa-home"></i><label class="hidden-xxs">Home</label></a>
		</li>
		<% } %>

		<li<% if (nav == 'packages') {%> class="active" <% } %>>
			<a href="#packages"><i class="fa fa-gift"></i><label class="hidden-xxs">Packages</label></a>
		</li>

		<li<% if (nav == 'tools') {%> class="active" <% } %> style="display:none">
			<a href="#tools"><i class="fa fa-wrench"></i><label class="hidden-xxs">Tools</label></a>
		</li>

		<li<% if (nav == 'assessments') {%> class="active" <% } %>>
			<a href="#assessments"><i class="fa fa-check"></i><label class="hidden-xxs">Assessments</label></a>
		</li>

		<li<% if (nav == 'results') {%> class="active" <% } %>>
			<a href="#results"><i class="fa fa-bug"></i><label class="hidden-xxs">Results</label></a>
		</li>

		<li<% if (nav == 'runs') {%> class="active" <% } %>>
			<a href="#run-requests"><i class="fa fa-bus"></i><label class="hidden-xxs">Runs</label></a>
		</li>
		
		<li<% if (nav == 'projects') {%> class="active" <% } %>>
			<a href="#projects"><i class="fa fa-folder-open"></i><label class="hidden-xxs">Projects</label></a>
		</li>

		<li<% if (nav == 'events') {%> class="active" <% } %>>
			<a href="#events?project=any"><i class="fa fa-bullhorn"></i><label class="hidden-xxs">Events</label></a>
		</li>
		
		<% if (isAdmin) { %>
		<li<% if (nav == 'settings') {%> class="active" <% } %>>
			<a href="#settings"><i class="fa fa-gears"></i><label class="hidden-xxs">Settings</label></a>
		</li>

		<li<% if (nav == 'overview') {%> class="active" <% } %>>
			<a href="#overview"><i class="fa fa-eye"></i><label class="hidden-xxs">Overview</label></a>
		</li>
		<% } %>
	</ul>
</div>
