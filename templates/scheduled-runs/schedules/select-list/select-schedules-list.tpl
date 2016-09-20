<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<th class="prepend select"></th>

			<th class="schedule first">
				<i class="fa fa-calendar"></i>
				<span>Schedule</span>
			</th>

			<th class="description last">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
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
<p>No schedules have been defined.</p>
<% } %>