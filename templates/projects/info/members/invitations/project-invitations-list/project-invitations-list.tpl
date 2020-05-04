<thead>
	<tr>
		<th class="name">
			<i class="fa fa-user"></i>
			<span>Name</span>
		</th>

		<% if (application.config.email_enabled) { %>
		<th class="email">
			<i class="fa fa-envelope"></i>
			<span>Email</span>
		</th>
		<% } else { %>
		<th class="username">
			<i class="fa fa-laptop"></i>
			<span>Username</span>
		</th>
		<% } %>

		<th class="date hidden-xs">
			<i class="fa fa-calendar"></i>
			<span>Date</span>
		</th>

		<th class="status">
			<i class="fa fa-info-circle"></i>
			<span>Status</span>
		</th>

		<% if (showDelete) { %>
		<th class="delete"></th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>