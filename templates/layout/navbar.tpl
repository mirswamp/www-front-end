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

	<div class="icons hidden-xxs">
		<i id="side-nav" class="active fa fa-toggle-left pull-right" data-placement="<%- opposite(orientation) %>" data-content="Switch to side navigation bar" data-container="body"></i>
	</div>

	<ul class="nav nav-pills nav-justified">

		<li<% if (nav == 'packages') {%> class="active" <% } %>>
			<a href="#packages"><i class="fa fa-gift"></i><label class="hidden-xs hidden-sm">Packages</label></a>
		</li>

		<li<% if (nav == 'tools') {%> class="active" <% } %> style="display:none">
			<a href="#tools"><i class="fa fa-wrench"></i><label class="hidden-xs hidden-sm">Tools</label></a>
		</li>

		<li<% if (nav == 'assessments') {%> class="active" <% } %>>
			<a href="#assessments"><i class="fa fa-check"></i><label class="hidden-xs hidden-sm">Assessments</label></a>
		</li>

		<li<% if (nav == 'results') {%> class="active" <% } %>>
			<a href="#results"><i class="fa fa-bug"></i><label class="hidden-xs hidden-sm">Results</label></a>
		</li>

		<li<% if (nav == 'projects') {%> class="active" <% } %>>
			<a href="#projects"><i class="fa fa-folder-open"></i><label class="hidden-xs hidden-sm">Projects</label></a>
		</li>
		
		<li<% if (nav == 'schedules') {%> class="active" <% } %>>
			<a href="#run-requests/schedules"><i class="fa fa-calendar"></i><label class="hidden-xs hidden-sm">Schedules</label></a>
		</li>

		<li<% if (nav == 'runs') {%> class="active" <% } %>>
			<a href="#run-requests"><i class="fa fa-bus"></i><label class="hidden-xs hidden-sm">Runs</label></a>
		</li>

		<% if (isAdmin) { %>
		<li<% if (nav == 'settings') {%> class="active" <% } %>>
			<a href="#settings"><i class="fa fa-gears"></i><label class="hidden-xs hidden-sm">Settings</label></a>
		</li>

		<li<% if (nav == 'overview') {%> class="active" <% } %>>
			<a href="#overview"><i class="fa fa-eye"></i><label class="hidden-xs hidden-sm">Overview</label></a>
		</li>
		<% } %>
	</ul>
</div>
