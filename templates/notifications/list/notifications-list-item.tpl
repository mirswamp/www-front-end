<td class="description">
	<% if (type == 'project invitation') { %>
		<i class="alert-icon fa fa-2x fa-folder" style="float:left; margin-left:10px; margin-right:20px"></i>
	<% } else if (type == 'admin invitation') { %>
		<i class="alert-icon fa fa-2x fa-user" style="float:left; margin-left:10px; margin-right:20px"></i>
	<% } else if (type == 'user permission') { %>
		<i class="alert-icon fa fa-2x fa-gavel" style="float:left; margin-left:10px; margin-right:20px"></i>
	<% } %>
	<%= description %>
</td>

<td class="datetime">
	<%= dateToSortableHTML(create_date) %>
</td>
