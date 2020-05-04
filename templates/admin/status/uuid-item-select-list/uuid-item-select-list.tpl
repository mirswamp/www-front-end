<thead>
	<tr>
		<th class="select">
			<input type="checkbox" class="select-all" />
		</th>

		<% for (var i = 0; i < fieldnames.length; i++) { %>
		<th class="<%= fieldnames[i] %>">
			<span><%= fieldnames[i] %></span>
		</th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>