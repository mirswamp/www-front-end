<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
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

			<th class="sharing">
				<i class="fa fa-share-alt"></i>
				<span>Sharing</span>
			</th>

			<th class="create-date last">
				<i class="fa fa-calendar"></i>
				<span>Create Date</span>
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
<p>No tools have been uploaded yet.</p>
<% } %>