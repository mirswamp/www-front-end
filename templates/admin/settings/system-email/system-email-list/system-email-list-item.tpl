<td class="prepend select">
	<input type="checkbox" name="select" value="<%- email %>" />
</td>

<td class="name first">
	<% if (model.has('user_uid')) { %>
		<a href="<%- url %>/<%- model.get('user_uid') %>"><%- model.getFullName() %></a>
	<% } else { %>
		<%- model.getFullName() %>
	<% } %>
</td>

<td class="email last">
	<a href="mailto:<%- email %>"><%= emailToHTML(email) %></a>
</td>		
