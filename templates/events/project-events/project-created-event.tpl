<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-folder"></i>Project <%- project_name %> Created</label>
		
	<div class="description">Project <a href="<%- url %>"><%- project_name %></a> was created.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>