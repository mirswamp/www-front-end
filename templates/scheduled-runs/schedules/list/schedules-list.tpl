<thead>
	<tr>
		<% if (showNumbering) { %>
		<th class="prepend number"></th>
		<% } %>
		
		<% if (showProjects) { %>
		<th class="project first">
			<i class="fa fa-folder"></i>
			<span class="hidden-xxs">Project</span>
		</th>
		<% } %>

		<th class="schedule"<% if (!showProjects) { %> first<% } %>>
			<i class="fa fa-calendar"></i>
			<span class="hidden-xxs">Schedule</span>
		</th>

		<th class="description last">
			<i class="fa fa-quote-left"></i>
			<span class="hidden-xxs">Description</span>
		</th>

		<% if (showDelete) { %>
		<th class="append"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>