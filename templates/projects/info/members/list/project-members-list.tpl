<thead>
	<tr>
		<th class="user">
			<i class="fa fa-user"></i>
			<span>User</span>
		</th>

		<% if (showEmail) { %>
		<th class="email">
			<i class="fa fa-envelope"></i>
			<span>Email</span>
		</th>
		<% } %>

		<% if (showUsername) { %>
		<th class="username">
			<i class="fa fa-laptop"></i>
			<span>Username</span>
		</th>
		<% } %>

		<th class="affiliation hidden-xs">
			<i class="fa fa-institution"></i>
			<span>Affiliation</span>
		</th>

		<th class="join-date hidden-xs">
			<i class="fa fa-calendar"></i>
			<span>Join Date</span>
		</th>

		<th class="admin">
			<i class="fa fa-user-md"></i>
			<span>Admin</span>
		</th>

		<% if (showDelete) { %>
		<th class="delete"></th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>