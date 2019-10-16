<thead>
	<tr class="titles">
		<% if (showNumbering) { %>
		<th class="prepend number"></th>
		<% } %>

		<% for (var i = 0; i < fieldnames.length; i++) { %>
		<% if (i == 0) { %> 
		<th class="first"> 
		<% } else if (i == fieldnames.length - 1) { %>
		<th class="last">
		<% } else { %>
		<th>
		<% } %>
			<span><%= fieldnames[i] %></span>
		</th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>
