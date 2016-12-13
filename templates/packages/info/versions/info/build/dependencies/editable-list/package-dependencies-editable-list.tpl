<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
				
			<th class="platform first">
				<i class="fa fa-bars"></i>
				<span>Platform</span>
			</th>

			<th class="dependencies-list last">
				<i class="fa fa-chain"></i>
				<span>Dependencies</span>
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No dependencies have been defined.</p>
<% } %>

<div class="middle buttons">
	<button id="add-new-dependency" class="btn"><i class="fa fa-plus"></i>Add New Dependency</button>
</div>