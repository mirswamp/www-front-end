<td class="title">
	<%- account.title %>
</td>

<td class="description">
	<%- account.description %>
</td>

<td class="externalid">
	<%- account.user_external_id %>
</td>

<td class="create_date">
	<%= dateToSortableHTML(account.create_date) %>
</td>

<% if (admin && showStatus) { %>
	<td class="status">
		<select class="status" style="width: 100px" data-linked_account_id="<%- account.linked_account_id %>">
			<option value="1"  <%- account.enabled_flag == 1 ? 'selected="selected"' : '' 					 %> >Enabled</option>
			<option value="0"  <%- account.enabled_flag == 1 ? '' 					 : 'selected="selected"' %> >Disabled</option>
		</select>
	</td>
<% } %>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
