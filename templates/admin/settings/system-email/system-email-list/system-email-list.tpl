<thead>
	<tr>
		<th class="select">
			<input type="checkbox" id="select-all" class="select-all"<% if (groupSelected) { %> checked<% } %> />
		</th>

		<th class="username">
			<i class="fa fa-laptop"></i>
			<span>Username</span>
		</th>

		<th class="name">
			<i class="fa fa-user"></i>
			<span>Name</span>
		</th>

		<th class="email<% if (!showHibernate) { %> last<% } %>">
			<i class="fa fa-envelope"></i>
			<span>Email</span>
		</th>

		<% if (showHibernate) { %>
		<th class="hibernate">
			<i class="fa fa-bed" data-toggle="popover" data-placement="top" data-content="Hibernating / Inactive" data-container="body"></i>
		</th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>