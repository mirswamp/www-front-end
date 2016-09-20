<% if (collection && collection.length > 0) { %>
<div class="table-responsive">
	<table>
		<thead>
			<tr>
				<th class="prepend select">
					<input type="checkbox" id="select-all" class="select-all" />
				</th>

				<th class="user first">
					<i class="fa fa-user"></i>
					<span>User</span>
				</th>

				<th class="email last">
					<i class="fa fa-envelope"></i>
					<span>Email</span>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>
<% } else { %>
<br />
<p>There are no system email users.</p>
<% } %>
