<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="username first">
				<i class="fa fa-laptop"></i>
				<span>Username</span>
			</th>

			<th class="user">
				<i class="fa fa-user"></i>
				<span>User</span>
			</th>

			<th class="affiliation hidden-md hidden-sm hidden-xs">
				<i class="fa fa-institution"></i>
				<span>Affiliation</span>
			</th>

			<th class="type hidden-sm hidden-xs">
				<i class="fa fa-group"></i>
				<span>Type</span>
			</th>

			<% if (showForcePasswordReset) { %>
			<th class="force-password-reset hidden-xs">
				<i class="fa fa-refresh" data-toggle="popover" data-placement="top" data-content="Force Password Reset" data-container="body"></i>
				<input type="checkbox" class="select-all" />
			</th>
			<% } %>

			<% if (showHibernate) { %>
			<th class="hibernate hidden-xs">
				<i class="fa fa-bed" data-toggle="popover" data-placement="top" data-content="Hibernating / Inactive" data-container="body"></i>
				<input type="checkbox" class="select-all" />
			</th>
			<% } %>

			<% if (showLinkedAccount) { %>
			<th class="has-linked-account hidden-xs">
				<i class="fa fa-link" data-toggle="popover" data-placement="top" data-content="Has Linked Account" data-container="body"></i>
			</th>
			<% } %>

			<th class="create-date hidden-xxs">
				<i class="fa fa-calendar"></i>
				<span>Create Date</span>
			</th>

			<th class="last-login-date hidden-sm hidden-xs">
				<i class="fa fa-keyboard-o"></i>
				<span>Last Login Date</span>
			</th>
			
			<th class="status last">
				<i class="fa fa-info-circle"></i>
				<span>Status</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No accounts have been registered yet.</p>
<% } %>
