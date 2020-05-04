<thead>
	<tr>
		<th class="provider">
			Provider
		</th>

		<th class="description">
			Description
		</th>

		<th class="externalid">
			External ID
		</th>

		<% if (admin && showStatus) { %>
			<th class="date">
				Create Date
			</th>
			<th class="status">
				Status
			</th>
		<% } else { %>
			<th class="date">
				Create Date
			</th>
		<% } %>

		<% if (showDelete) { %>
		<th class="delete"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>