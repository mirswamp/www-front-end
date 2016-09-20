<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
			
			<th class="event first">
				<i class="fa fa-bullhorn"></i>
				<span>Event</span>
			</th>

			<th class="date last">
				<i class="fa fa-calendar"></i>
				<span>Date / Time</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No events.</p>
<% } %>