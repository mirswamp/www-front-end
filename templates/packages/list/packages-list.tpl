<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr class="titles">
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="package first">
				<i class="fa fa-gift"></i>
				<span class="hidden-xxs">Package</span>
			</th>

			<th class="description hidden-xs">
				<i class="fa fa-quote-left"></i>
				<span class="hidden-xxs">Description</span>
			</th>

			<th class="type">
				<i class="fa fa-code"></i>
				<span class="hidden-xxs">Type</span>
			</th>
			
			<th class="versions last">
				<i class="fa fa-list-ol"></i>
				<span class="hidden-xxs">Versions</span>
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
<p>No packages have been uploaded yet.</p>
<% } %>