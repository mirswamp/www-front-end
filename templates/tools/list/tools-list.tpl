<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr class="titles">
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
			
			<th class="tool first">
				<i class="fa fa-wrench"></i>
				<span>Tool</span>
			</th>

			<th class="package-types">
				<i class="fa fa-code"></i>
				<span>Package Types</span>
			</th>

			<th class="description hidden-xs">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>
			
			<th class="versions last hidden-sm">
				<i class="fa fa-list-ol"></i>
				<span>Versions</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No tools have been uploaded yet.</p>
<% } %>