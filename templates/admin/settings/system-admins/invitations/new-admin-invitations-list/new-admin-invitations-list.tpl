<% if (collection && collection.length > 0) { %>
<form class="admin-invitations-form">
	<table>
		<thead>
			<tr>
				<th class="name first">
					Name
				</th>

				<% if (config['email_enabled']) { %>
				<th class="email last">
					Email
				</th>
				<% } else { %>
				<th class="username last">
					Username
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
<p>No new administrator invitations.</p>
<% } %>