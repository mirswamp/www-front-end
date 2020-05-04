<td class="name">
	<% if (url) { %>
	<a href="<%- url %>" target="_blank"><%- name %></a>
	<% } else { %>
		<%- name %>
	<% } %>
</td>

<% if (showProjects) { %>
<td class="project">
	<% if (projectUrl) { %>
	<a href="<%- projectUrl %>" target="_blank"><%- project_name %></a>
	<% } else { %>
		<%- project_name %>
	<% } %>
</td>
<% } %>

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