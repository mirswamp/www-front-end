<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-user"></i>User Last Logged In</label>
	<div class="description">You previously logged in.</div>
</td>

<td class="date">
	<%= date? date.format() : '' %>
</td>