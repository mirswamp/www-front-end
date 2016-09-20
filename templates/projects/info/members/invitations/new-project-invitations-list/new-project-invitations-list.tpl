<% if (collection && collection.length > 0) { %>
<form class="invitations-form">
<table>
	<thead>
		<tr class="titles">
			<th class="name first">
				<i class="fa fa-user"></i>
				<span>Name</span>
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
</table>
</form>
<% } else { %>
<br />
<p>No new project invitations.</p>
<% } %>
