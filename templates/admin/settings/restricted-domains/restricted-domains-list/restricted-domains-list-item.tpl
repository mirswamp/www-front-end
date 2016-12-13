<td class="domain-name first">
	<input type="text" class="form-control" <% if (typeof domain_name !== 'undefined') { %>value="<%- domain_name %>"<% } %>>
</td>

<td class="description last">
	<input type="text" class="form-control" <% if (typeof description !== 'undefined') { %>value="<%- description %>"<% } %> />
</td>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>

				