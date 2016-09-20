<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
		
			<th class="key first">
				<i class="fa fa-key"></i>
				<span>Key</span>
			</th>

			<th class="value<% if (!editable) { %> last<% } %>">
				<i class="fa fa-tag"></i>
				<span>Value</span>
			</th>

			<% if (editable) { %>
			<th class="order last">
				<i class="fa fa-list"></i>
				<span>Order</span>
			</th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No key value pairs.</p>
<% } %>

<% if (editable) { %>
<div class="top buttons">
	<button type="button" class="add btn btn-sm" id="add-new-pair" class="btn btn-sm" data-toggle="tooltip" data-content="Add new key value pair" data-placement="left" tabindex="-1"><i class="fa fa-plus"></i></button>
</div>
<% } %>