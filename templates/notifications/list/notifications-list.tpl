<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr class="titles">
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="description">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>

			<th class="datetime last">
				<i class="fa fa-calendar"></i>
				<span>Date</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No notifications.</p>
<% } %>