<td class="user first">
	<% if (model.has('user_uid')) { %>
		<a href="<%- url %>/<%- model.get('user_uid') %>"><%- model.getFullName() %></a>
	<% } else { %>
		<%- model.getFullName() %>
	<% } %>
</td>
 
<% if (config['email_enabled']) { %>
<td class="email last">
	<a href="mailto:<%- email %>"><%= emailToHTML(email) %></a>
</td>
<% } else { %>
<td class="username last">
	<%= username %>
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
				