<% if (showNumbering) { %>
<td class="prepend number">
</td>
<% } %>

<td class="event first">
	<%= info %>
</td>

<td class="date last">
	<%= date ? dateToSortableHTML(date) : "?" %>
</td>


