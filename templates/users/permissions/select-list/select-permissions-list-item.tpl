<td class="title">
	<span class="title"><%- title %></span>
</td>

<td class="description">
	<span class="name"><%- description %></span>
</td>

<td class="expiration">
	<span class="expiration"><%= dateToSortableHTML(expiration_date) %></span>
</td>

<td class="status">
	<% if (admin) { %>
		<select class="status" style="width: 100px">
			<option<%- status == null ? ' selected="selected"' : ''%>></option>
			<option<%- status == 'granted' ? ' selected="selected"' : ''%>>granted</option>
			<option<%- status == 'revoked' ? ' selected="selected"' : ''%>>revoked</option>
			<option<%- status == 'pending' ? ' selected="selected"' : ''%>>pending</option>
			<option<%- status == 'expired' ? ' selected="selected"' : ''%>>expired</option>
			<option<%- status == 'denied' ? ' selected="selected"' : ''%>>denied</option>
		</select>
	<% } else { %>
		<span class="status"><%- status %></span>
	<% } %>
</td>

<td style="background: white" class="request">
	<% if (!admin) { %>
	<% if (status == 'expired') { %>
	<button class="btn renew">Renew</button>
	<% } else if (status != 'granted' && status != 'pending') { %>
	<button class="btn request">Request</button>
	<% } %>
	<% } %>
</td>
