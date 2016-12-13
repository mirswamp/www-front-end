<td class="prepend select">
	<input type="radio" name="schedule" index="<%- itemIndex %>" />
</td>

<td class="schedule first">
	<% if (url) { %>
	<a href="<%- url %>"><%- name %></a>
	<% } else { %>
		<%- name %>
	<% } %>
</td>

<td class="description last">
	<%- description %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<% if (url) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>
