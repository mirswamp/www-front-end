<td class="username">
	<a href="<%- url %>" target="_blank"><%- username %></a>
</td>

<td class="name">
	<% if (email) { %>
	<a href="mailto:<%- email %>"><%= name %></a>
	<% } else { %>
	<%= name %>
	<% } %>
</td>

<td class="affiliation hidden-md hidden-sm hidden-xs">
	<%- affiliation %>
</td>

<% if (showType) { %>
<td class="type hidden-md hidden-sm hidden-xs">
	<% if (user_type) { %>
	<%= user_type.replace('-', ' ') %>
	<% } %>
</td>
<% } %>

<% if (showForcePasswordReset && !application.config.ldap_readonly) { %>
<td class="force-password-reset condensed hidden-sm hidden-xs">
	<input type="checkbox" name="select"<% if (forcepwreset_flag) { %> checked<% } %>/>
</td>
<% } %>

<% if (showHibernate && !application.config.ldap_readonly) { %>
<td class="hibernate condensed hidden-sm hidden-xs">
	<input type="checkbox" name="select"<% if (hibernate_flag) { %> checked<% } %>/>
</td>
<% } %>

<% if (showLinkedAccount) { %>
<td class="has-linked-account condensed hidden-sm hidden-xs">
	<% if (has_linked_account) { %>
	yes
	<% } else { %>
	no
	<% } %>
</td>
<% } %>

<% if (showStats) { %>

<% if (showNumPackages) { %>
<td class="num-packages condensed hidden-xs">
</td>
<% } %>

<% if (showNumProjects) { %>
<td class="num-projects condensed hidden-xs">
</td>
<% } %>

<% if (showNumRuns) { %>
<td class="num-runs condensed hidden-xs">
</td>
<% } %>

<% if (showNumResults) { %>
<td class="num-results condensed hidden-xs">
</td>
<% } %>

<% if (showSuccessRate) { %>
<td class="success-rate condensed hidden-xs">
</td>
<% } %>

<% } %>

<td class="create-date datetime hidden-xxs">
	<%= dateToSortableHTML(create_date) %>
</td>

<td class="last-login-date datetime hidden-md hidden-sm hidden-xs">
	<% if (ultimate_login_date) { %>
	<%= dateToSortableHTML(ultimate_login_date) %>
	<% } %>
</td>

<td class="status">
	<% if (application.config.ldap_readonly) { %>
	<%= status.toTitleCase() %>
	<% } else { %>
	<div class="btn-group">
		<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown">
			<% if (!isEnabled) { %><span class="warning"><% } %>
			<%- status.toTitleCase() %>
			<% if (!isEnabled) { %></span><% } %>
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