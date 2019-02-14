<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% if (showProjects) { %>
<td class="project first">
	<% if (projectUrl) { %>
	<a href="<%- projectUrl %>" target="_blank"><%- project_name %></a>
	<% } else { %>
		<%- project_name %>
	<% } %>
</td>
<% } %>

<td class="name"<% if (!showProjects) { %> first<% } %>>
	<% if (url) { %>
	<a href="<%- url %>" target="_blank"><%- name %></a>
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
