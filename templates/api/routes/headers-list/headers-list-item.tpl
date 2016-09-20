<% if (showNumbering) { %>
<td class="prepend number">
</td>
<% } %>

<td <% if (editable) { %>contenteditable="true" <% } %>class="name code first">
	<%= name %>
</td>

<td <% if (editable) { %>contenteditable="true" <% } %>class="type code">
	<%= type %>
</td>

<td <% if (editable) { %>contenteditable="true" <% } %>class="description half-width">
	<%= description %>
</td>

<td class="optional<% if (!editable) { %> last<% } %>">
<% if (editable) { %>
	<input type="checkbox" class="optional" <% if (optional) {%>checked<% } %>>
<% } else { %>
<% if (optional) { %>
	<span class="success">&#x2713;</span>
<% } %>
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


