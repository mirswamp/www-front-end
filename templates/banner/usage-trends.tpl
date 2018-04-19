<% var limit = 5 %>
<% var min = Math.max(0, data.length - limit); %>
<% var max = data.length; %>
<table>
	<thead>
		<tr>
			<th>
				<span></span>
			</th>
			<% for (var i = min; i < max; i++) { %>
			<th>
				<span><%= new Date(data[i].create_date).format('mm/dd/yyyy') %></span>
			</th>
			<% } %>
		</tr>
	</thead>

	<tbody>
		<tr>
			<td>
				<label>Uploads</label>
			</td>
			<% for (var i = min; i < max; i++) { %>
			<td>
				<span><%= data[i].package_uploads %></span>
			</th>
			<% } %>
		</tr>
		<tr>
			<td>
				<label>Assessments</label>
			</td>
			<% for (var i = min; i < max; i++) { %>
			<td>
				<span><%= data[i].assessments %></span>
			</th>
			<% } %>
		</tr>
		<tr>
			<td>
				<label>LOC</label>
			</td>
			<% for (var i = 0; i < Math.min(data.length, limit); i++) { %>
			<td>
				<span><%= data[i].loc %></span>
			</th>
			<% } %>
		</tr>		
	</tbody>
</table>

