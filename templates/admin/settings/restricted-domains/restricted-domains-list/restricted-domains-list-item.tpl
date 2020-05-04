<td class="domain-name">
	<input type="text" class="form-control" <% if (typeof domain_name !== 'undefined') { %>value="<%- domain_name %>"<% } %>>
</td>

<td class="description">
	<input type="text" class="form-control" <% if (typeof description !== 'undefined') { %>value="<%- description %>"<% } %> />
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>

				