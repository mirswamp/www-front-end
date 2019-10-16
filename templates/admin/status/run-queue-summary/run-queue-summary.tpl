<thead>
	<th>Run</th>
	<th>Jobs</th>
	<th>Completed</th>
	<th>Removed</th>
	<th>Idle</th>
	<th>Running</th>
	<th>Held</th>
	<th>Suspended</th>
</thead>
<tbody>
	<tr>
		<td>aruns</td>
		<td><%- aruns['jobs'] || 0 %></td>
		<td><%- aruns['completed'] || 0 %></td>
		<td><%- aruns['removed'] || 0 %></td>
		<td><%- aruns['idle'] || 0 %></td>
		<td class="success"><%- aruns['running'] || 0 %></td>
		<td class="caution"><%- aruns['held'] || 0 %></td>
		<td class="warning"><%- aruns['suspended'] || 0 %></td>
	</tr>
	<tr>
		<td>vruns</td>
		<td><%- vruns['jobs'] || 0 %></td>
		<td><%- vruns['completed'] || 0 %></td>
		<td><%- vruns['removed'] || 0%></td>
		<td><%- vruns['idle'] || 0 %></td>
		<td class="success"><%- vruns['running'] || 0 %></td>
		<td class="caution"><%- vruns['held'] || 0 %></td>
		<td class="warning"><%- vruns['suspended'] || 0 %></td>
	</tr>
	<tr>
		<td>mruns</td>
		<td><%- mruns['jobs'] || 0 %></td>
		<td><%- mruns['completed'] || 0 %></td>
		<td><%- mruns['removed'] || 0 %></td>
		<td><%- mruns['idle'] || 0 %></td>
		<td class="success"><%- mruns['running'] || 0 %></td>
		<td class="caution"><%- mruns['held'] || 0 %></td>
		<td class="warning"><%- mruns['suspended'] || 0 %></td>
	</tr>
	<tr>
		<td><b>Total</b></td>
		<td><b><%- total['jobs'] || 0 %></b></td>
		<td><b><%- total['completed'] || 0 %></b></td>
		<td><b><%- total['removed'] || 0 %></b></td>
		<td><b><%- total['idle'] || 0 %></b></td>
		<td class="success"><b><%- total['running'] || 0 %></b></td>
		<td class="caution"><b><%- total['held'] || 0 %></b></td>
		<td class="warning"><b><%- total['suspended'] || 0 %></b></td>
	</tr>
</tbody>
