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

			<th class="description">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>

			<th class="create-date datetime last">
				<i class="fa fa-calendar"></i>
				<span>Date Added</span>
			</th>

			<% if (showDelete) { %>
			<th class="append"></th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No projects.</p>
<% } %>