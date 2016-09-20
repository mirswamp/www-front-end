<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
			
			<th class="package first">
				<i class="fa fa-gift"></i>
				<span>Package</span>
			</th>

			<th class="type">
				<i class="fa fa-code"></i>
				<span>Type</span>
			</th>

			<th class="create-date last">
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
<p>No packages have been uploaded yet.</p>
<% } %>
