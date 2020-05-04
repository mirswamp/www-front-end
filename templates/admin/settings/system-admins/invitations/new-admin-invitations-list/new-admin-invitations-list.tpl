<thead>
	<tr>
		<th class="name">
			Name
		</th>

		<% if (application.config.email_enabled) { %>
		<th class="email">
			Email
		</th>
		<% } else { %>
		<th class="username">
			Username
		</th>
		<% } %>

		<% if (showDelete) { %>
		<th class="delete"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>