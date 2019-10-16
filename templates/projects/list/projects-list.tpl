<thead>
	<tr>
		<% if (showNumbering) { %>
		<th class="prepend number"></th>
		<% } %>
		
		<th class="project first">
			<i class="fa fa-folder-open"></i>
			<span class="hidden-xxs">Project</span>
		</th>

		<th class="description">
			<i class="fa fa-quote-left"></i>
			<span class="hidden-xxs">Description</span>
		</th>

		<th class="create-date datetime last">
			<i class="fa fa-calendar"></i>
			<span class="hidden-xxs">Date Added</span>
		</th>

		<% if (showDelete) { %>
		<th class="append"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>