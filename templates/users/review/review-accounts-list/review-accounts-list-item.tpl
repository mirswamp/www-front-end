<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="username first">
	<a href="<%- url %>"><%- model.get('username') %></a>
</td>

<td class="name">
	<% if (model.has('email')) { %>
	<a href="mailto:<%- model.get('email') %>"><%- model.getFullName() %></a>
	<% } else { %>
	<%- model.getFullName() %>
	<% } %>
</td>

<td class="affiliation hidden-md hidden-sm hidden-xs">
	<%- model.get('affiliation') %>
</td>

<td class="type hidden-sm hidden-xs">
	<% if (model.has('user_type')) { %>
	<%- model.get('user_type').replace('-', ' ') %>
	<% } %>
</td>

<% if (showForcePasswordReset && !config['ldap_readonly']) { %>
<td class="force-password-reset hidden-xs">
	<input type="checkbox" name="select"<% if (model.get('forcepwreset_flag')) { %> checked<% } %>/>
</td>
<% } %>

<% if (showHibernate && !config['ldap_readonly']) { %>
<td class="hibernate hidden-xs">
	<input type="checkbox" name="select"<% if (model.get('hibernate_flag')) { %> checked<% } %>/>
</td>
<% } %>

<% if (showLinkedAccount) { %>
<td class="has-linked-account hidden-xs">
	<% if (model.get('has_linked_account')) { %>
	<i class="fa fa-chain"></i>
	<% } %>
</td>
<% } %>

<td class="create-date datetime hidden-xxs">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML(model.getCreateDate()) %>
	<% } %>
</td>

<td class="last-login-date datetime hidden-sm hidden-xs">
	<% if (model.has('ultimate_login_date')) { %>
	<%= dateToSortableHTML(model.get('ultimate_login_date')) %>
	<% } %>
</td>

<td class="status last">
	<% if (config['ldap_readonly']) { %>
	<%- model.getStatus().toTitleCase() %>
	<% } else { %>
	<div class="btn-group">
		<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown">
			<% if (!model.isEnabled()) { %><span class="warning"><% } %>
			<%- model.getStatus().toTitleCase() %>
			<% if (!model.isEnabled()) { %></span><% } %>
			<span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			<li><a class="pending">Pending</a></li>
			<li><a class="enabled">Enabled</a></li>
			<li><a class="disabled">Disabled</a></li>
		</ul>
	</div>
	<% } %>
</td>
