<td class="select">
	<input type="checkbox" name="select"<% if (selected) { %> checked<% } %> />
</td>

<td class="username">
	<% if (url) { %>
		<a href="<%= url %>" target="_blank"><%= username %></a>
	<% } else { %>
		<%= username %>
	<% } %>
</td>

<td class="name">
	<%- name %>
</td>

<td class="email<% if (!showHibernate) { %> last<% } %>">
	<a href="mailto:<%- email %>"><%= email %></a>
</td>

<% if (showHibernate) { %>
<td class="hibernate">
	<% if (is_hibernating) { %>
		hibernating
	<% } %>
</td>
<% } %>	