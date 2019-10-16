<thead>
	<tr>
		<th class="title first">
			Provider
		</th>

		<th class="description">
			Description
		</th>

		<th class="externalid">
			External ID
		</th>

		<% if (admin && showStatus) { %>
			<th class="create_date">
				Create Date
			</th>
			<th class="status last">
				Status
			</th>
		<% } else { %>
			<th class="create_date last">
				Create Date
			</th>
		<% } %>

		<% if (showDelete) { %>
		<th class="append"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>