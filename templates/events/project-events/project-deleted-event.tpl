<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-folder-o"></i>Project <%- project_name %> Deleted</label>
		
	<div class="description">Project <a href="<%- url %>"><%- project_name %></a> was deleted by its owner.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>