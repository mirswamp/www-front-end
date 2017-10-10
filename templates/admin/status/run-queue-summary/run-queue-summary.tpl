<table style="text-align:center">
	<thead>
		<th>Jobs</th>
		<th>Completed</th>
		<th>Removed</th>
		<th>Idle</th>
		<th>Running</th>
		<th>Held</th>
		<th>Suspended</th>
	</thead>
	<tbody>
		<td><%- jobs %></td>
		<td><%- completed %></td>
		<td><%- removed %></td>
		<td><%- idle %></td>
		<td class="success"><%- running %></td>
		<td class="caution"><%- held %></td>
		<td class="warning"><%- suspended %></td>
	</tbody>
</table>
