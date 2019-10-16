<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="prepend select">
	<input type="checkbox" name="select" value="<%- email %>" />
</td>

<td class="username first">
	<% if (model.has('user_uid')) { %>
		<a href="<%- url %>/<%- model.get('user_uid') %>"><%- model.get('username') %></a>
	<% } else { %>
		<%- model.get('username') %>
	<% } %>
</td>

<td class="name">
	<%- model.getFullName() %>
</td>

<td class="email<% if (!showHibernate) { %> last<% } %>">
	<a href="mailto:<%- email %>"><%= emailToHTML(email) %></a>
</td>

<% if (showHibernate) { %>
<td class="hibernate last">
	<% if (model.isHibernating()) { %>
		hibernating
	<% } %>
</td>
<% } %>	
