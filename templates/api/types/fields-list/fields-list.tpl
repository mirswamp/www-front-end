<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
		
			<th class="name first">
				<i class="fa fa-font"></i>
				<span>Name</span>
			</th>

			<th class="type last">
				<i class="fa fa-code"></i>
				<span>Type</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No api type fields.</p>
<% } %>