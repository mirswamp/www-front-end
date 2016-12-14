<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr class="titles">
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="platform first">
				<i class="fa fa-bars"></i>
				<span>Platform</span>
			</th>

			<th class="description">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>
			
			<th class="versions last">
				<i class="fa fa-list-ol"></i>
				<span>Versions</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No platforms have been uploaded yet.</p>
<% } %>