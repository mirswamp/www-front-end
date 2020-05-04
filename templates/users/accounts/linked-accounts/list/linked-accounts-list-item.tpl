<td class="provider">
	<%- title %>
</td>

<td class="description">
	<%- description %>
</td>

<td class="externalid">
	<%- user_external_id %>
</td>

<td class="date">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (admin && showStatus) { %>
	<td class="status">
		<select class="status" style="width: 100px" data-linked_account_id="<%- linked_account_id %>">
			<option value="1" <%- enabled_flag == 1 ? 'selected="selected"' : ''%>>Enabled</option>
			<option value="0" <%- enabled_flag == 1 ? '': 'selected="selected"' %>>Disabled</option>
		</select>
	</td>
<% } %>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>