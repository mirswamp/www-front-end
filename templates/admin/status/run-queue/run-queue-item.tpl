<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="submitted first">
	<%= submitted %>
</td>

<td class="exec-run">
	<a href="<%= url %>" target="blank"><%= exec_run_uuid.replace(/_/g, '_<wbr>') %></a>
</td>

<td class="cmd">
	<%= cmd %>
</td>

<td class="run-time">
	<%= run_time %>
</td>

<td class="pri">
	<%= pri %>
</td>

<td class="image">
	<%= image %>
</td>

<td class="disk">
	<%= disk %>
</td>

<td class="host">
	<%= host %>
</td>

<td class="vm">
	<%= vm.replace(/_/g, '_<wbr>') %>
</td>

<td class="status last<% if (status == 'Running') { %> success<% } %>">
	<%= status %>
</td>
