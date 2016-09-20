<form class="run-requests-form">
<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<th class="type first">
				<i class="fa fa-info-circle"></i>
				<span>Type</span>
			</th>

			<th class="day">
				<i class="fa fa-calendar"></i>
				<span>Day</span>
			</th>

			<th class="time last">
				<i class="fa fa-clock-o"></i>
				<span>Time</span>
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
<p>No run requests have been defined.</p>
<% } %>
</form>
