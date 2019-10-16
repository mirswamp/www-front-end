<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="project first">
	<a href="<%- url %>"><%- model.get('full_name') %></a>
</td>

<td class="owner">
	<% if (model && model.has('owner')) { %>
		<% if (model.get('owner').has('email')) { %>
		<a href="mailto:<%- model.get('owner').get('email') %>">
			<%- model.get('owner').getFullName() %>
		</a>
		<% } else { %>
			<%- model.get('owner').getFullName() %>
		<% } %>
	<% } %>
</td>

<td class="create-date datetime">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML(model.getCreateDate()) %>
	<% } %>
</td>

<td class="status last">
	<div class="btn-group">
		<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown">
			<% if ( model.isDeactivated() ) { %><span class="warning"><% } %>
			<%- model.getStatus().toTitleCase() %>
			<% if (model.getStatus() != "activated") { %></span><% } %>
			<span class="caret"></span>
		</a>
	 	<% if (model.isDeactivated()) { %>
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
