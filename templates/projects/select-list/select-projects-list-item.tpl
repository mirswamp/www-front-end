<td class="select">
	<% if (trial_project_flag) { %>
	<input type="checkbox" name="select-assessment" checked onclick="return false;" />
	<% } else { %>
	<input type="checkbox" name="select-assessment" />
	<% } %>
</td>

<td class="project">
	<a href="#projects/<%- project_uid %>" target="_blank"><%- full_name %></a>
</td>

<td class="description">
	<%- description %>
</td>
