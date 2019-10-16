<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-folder-o"></i>Project <%- project_name %> Rejected</label>

	<div class="description">Project <a href="<%- url %>"><%- project_name %></a> was rejected by a SWAMP administrator.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>