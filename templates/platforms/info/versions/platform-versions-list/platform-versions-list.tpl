<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<th class="version-string first">
				<i class="fa fa-list-ol"></i>
				<span>Version</span>
			</th>
			<th class="notes">
				<i class="fa fa-pencil-square"></i>
				<span>Notes</span>
			</th>
			<th class="date last">
				<i class="fa fa-calendar"></i>
				<span>Date Added</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No platform versions have been defined.</p>
<% } %>