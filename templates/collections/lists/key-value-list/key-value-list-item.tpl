<td <% if (editable) { %>contenteditable="true" <% } %>class="key code">
	<%= key %>
</td>

<td <% if (editable) { %>contenteditable="true" <% } %>class="value code<% if (!editable) { %> last<% } %>">
	<% if (value !== undefined) { %>
	<%= value %>
	<% } else { %>
	<span class="warning">undefined</span>
	<% } %>
</td>

<% if (editable) { %>
<td class="order">
<% if (index != 0) { %>
<button type="button" class="move-up btn btn-sm" tabindex="-1"><i class="fa fa-arrow-up"></i></button>
<% } %>
<% if (index != num - 1) { %>
<button type="button" class="move-down btn btn-sm" tabindex="-1"><i class="fa fa-arrow-down"></i></button>
<% } %>
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm" tabindex="-1"><i class="fa fa-times"></i></button>
</td>
<% } %>