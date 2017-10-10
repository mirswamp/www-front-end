<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="exec-run first">
	<a href="<%= url %>" target="blank"><%= exec_run_uuid.replace(/_/g, '_<wbr>') %></a>
</td>

<td class="vm-hostname">
	<%= vm_hostname %>
</td>

<td class="project">
	<a href="<%= project_url %>" target="blank"><%= project_uuid.replace(/_/g, '_<wbr>') %></a>
</td>

<td class="status last<% if (!status.contains(['Finished', 'Held', 'Suspended'], false)) { %> success<% } %>">
	<%= status %>
</td>
