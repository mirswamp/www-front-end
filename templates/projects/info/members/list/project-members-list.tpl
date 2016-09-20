<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
			
			<th class="user first">
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

			<th class="admin last">
				<i class="fa fa-user-md"></i>
				<span>Admin</span>
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
<p>This project has no members.</p>
<% } %>
