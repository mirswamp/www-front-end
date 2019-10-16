<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-user"></i>User Registered</label>

	<div class="description">You registered for the SWAMP.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>