<thead>
	<tr>
		<th class="user first">
			<i class="fa fa-user"></i>
			<span>User</span>
		</th>

		<% if (config['email_enabled']) { %>
		<th class="email last">
			<i class="fa fa-envelope"></i>
			<span>Email</span>
		</th>
		<% } else { %>
		<th class="username last">
			<i class="fa fa-laptop"></i>
			<span>Username</span>
		</th>
		<% } %>

		<% if (showDelete) { %>
		<th class="append"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>