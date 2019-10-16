<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-folder-open"></i>Project <%- project_name %> Approved</label>

	<div class="description">Project <a href="<%- url %>"><%- project_name %></a> was approved by a SWAMP administrator.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>