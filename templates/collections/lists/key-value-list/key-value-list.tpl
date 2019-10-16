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