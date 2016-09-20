<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
			
			<th class="project first">
				<i class="fa fa-folder-open"></i>
				<span>Project</span>
			</th>

			<th class="owner">
				<i class="fa fa-user"></i>
				<span>Owner</span>
			</th>

			<th class="create-date">
				<i class="fa fa-calendar"></i>
				<span>Create Date</span>
			</th>

			<th class="status last">
				<i class="fa fa-info-circle"></i>
				<span>Status</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No projects have been registered yet.</p>
<% } %>
