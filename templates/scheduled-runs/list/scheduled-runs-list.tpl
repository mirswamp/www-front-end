<% if (typeof name !== 'undefined') { %>

<% if (runRequestUrl) { %>
<a href="<%- runRequestUrl %>">
	<h2><i class="fa fa-calendar"></i><%- name %></h2>
</a>
<% } else { %>
<h2><i class="fa fa-calendar"></i><%- name %></h2>
<% } %>

<% if (typeof description !== 'undefined') { %>
<% description = description.toLowerCase(); %> 

<% if (description.startsWith('run')) { %>
<% description = description.replace('run', ''); %>
<% } %>

<% if (description.startsWith('runs')) { %>
<% description = description.replace('runs', ''); %>
<% } %>

<p>The following assessments are run <%= description %></p>
<% } %>
<% } %>

<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="package<% if (!showProjects) { %> first<% } %>">
				<i class="fa fa-gift"></i>
				<span>Package</span>
			</th>

			<th class="tool">
				<i class="fa fa-wrench"></i>
				<span>Tool</span>
			</th>

			<th class="platform<% if (!showSchedule && !showProjects) { %> last<% } %>">
				<i class="fa fa-bars"></i>
				<span>Platform</span>
			</th>

			<% if (showProjects) { %>
			<th class="project<% if (!showSchedule) { %> last<% } %>">
				<i class="fa fa-folder"></i>
				<span>Project</span>
			</th>
			<% } %>

			<% if (showSchedule) { %>
			<th class="schedule last">
				<i class="fa fa-calendar"></i>
				<span>Schedule</span>
			</th>
			<% } %>

			<% if (showDelete) { %>
			<th class="append"></th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No scheduled runs have been defined.</p>
<% } %>
