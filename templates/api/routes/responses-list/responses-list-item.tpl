<% if (showNumbering) { %>
<td class="prepend number">
</td>
<% } %>

<td <% if (editable) { %>contenteditable="true" <% } %>class="status-code code first">
	<% if (typeof status_code != 'undefined') { %>
	<%= status_code %>
	<% } %>
</td>

<td <% if (editable) { %>contenteditable="true" <% } %>class="type code">
	<% if (!editable && model.isPrimitiveType()) { %>
		<span class="tag"><%= type %></span>
	<% } else if (typeof type != 'undefined') { %>
		<%= type %>
	<% } %>
</td>

<td <% if (editable) { %>contenteditable="true" <% } %>class="description half-width">
	<% if (typeof description != 'undefined') { %>
	<%= description %>
	<% } %>
</td>

<% if (editable) { %>
<td class="order last">
<% if (index != 0) { %>
<button type="button" class="move-up btn btn-sm"><i class="fa fa-arrow-up"></i></button>
<% } %>
<% if (index != num - 1) { %>
<button type="button" class="move-down btn btn-sm"><i class="fa fa-arrow-down"></i></button>
<% } %>
</td>
<% } %>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>


