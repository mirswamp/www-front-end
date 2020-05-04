<td class="select">
	<input type="radio" name="schedule" index="<%- itemIndex %>" />
</td>

<td class="schedule">
	<% if (url) { %>
	<a href="<%- url %>" target="_blank" target="_blank"><%= name %></a>
	<% } else { %>
		<%= name %>
	<% } %>
</td>

<td class="description">
	<%- description %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (url) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>