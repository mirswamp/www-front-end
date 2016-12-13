<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<th class="prepend select">
			</th>

			<th class="project first">
				<i class="fa fa-folder-open"></i>
				<span class="hidden-xxs">Project</span>
			</th>
			
			<th class="description last">
				<i class="fa fa-quote-left"></i>
				<span class="hidden-xxs">Description</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No projects.</p>
<% } %>