<thead>
	<tr>
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
		<th class="schedule">
			<i class="fa fa-calendar"></i>
			<span>Schedule</span>
		</th>
		<% } %>

		<% if (showDelete) { %>
		<th class="delete"></th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>