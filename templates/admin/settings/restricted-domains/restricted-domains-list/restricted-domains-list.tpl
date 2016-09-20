<table>
	<thead>
		<tr>
			<th class="domain-name first">
				<i class="fa fa-at"></i>
				<span>Domain</span>
			</th>

			<th class="description last">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>

			<% if (showDelete) { %>
			<th class="append"></th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% if (collection && collection.length == 0) { %>
<br />
<p>No restricted domains.</p>
<% } %>
