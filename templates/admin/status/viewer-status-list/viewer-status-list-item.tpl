<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="vm-hostname first">
	<%= vm_hostname %>
</td>

<td class="name">
	<%= name %>
</td>

<td class="state">
	<%= state %>
</td>

<td class="vm-ip">
	<%= vm_ip %>
</td>

<td class="project">
	<a href="<%= project_url %>" target="blank"><%= project_uuid.replace(/_/g, '_<wbr>') %></a>
</td>

<td class="viewer-instance">
	<%= viewer_instance_uuid %>
</td>

<td class="api-key">
	<%= api_key %>
</td>

<td class="url_uuid">
	<%= url_uuid %>
</td>

<td class="status last">
	<%= status %>
</td>