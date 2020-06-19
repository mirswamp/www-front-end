<td class="project">
	<a href="<%= url %>" target="_blank"><%- full_name %></a>
</td>

<td class="owner">
	<% if (ownerName) { %>
		<a href="<%= ownerUrl %>" target="_blank"><%= ownerName %></a>
	<% } %>
</td>

<td class="create-date datetime">
	<% if (typeof create_date !== 'undefined') { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<td class="status">
	<div class="btn-group">
		<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown">
			<% if (isDeactivated) { %><span class="warning"><% } %>
			<%- status.toTitleCase() %>
			<% if (status != "activated") { %></span><% } %>
			<span class="caret"></span>
		</a>
	 	<% if (isDeactivated) { %>
		<ul class="dropdown-menu">
			<li><a class="activated">Activated</a></li>
		</ul>
		<% } else { %>
		<ul class="dropdown-menu">
			<li><a class="deactivated">Deactivated</a></li>
		</ul>
		<% } %>
	</div>
</td>