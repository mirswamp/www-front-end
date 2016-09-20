<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="name first">
				<i class="fa fa-font"></i>
				<span>Name</span>
			</th>

			<th class="type">
				<i class="fa fa-code"></i>
				<span>Type</span>
			</th>

			<th class="description half-width">
				<i class="fa fa-quote-left"></i>
				<span>Description</span>
			</th>

			<th class="optional<% if (!editable) { %> last<% } %>">
				<i class="fa fa-question-circle"></i>
				<span>Optional</span>
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
<% if (editable) { %>
<div class="top buttons pull-right">
	<button type="button" id="add-new-header" class="add btn btn-sm" data-toggle="tooltip" data-content="Add new header" data-placement="left"><i class="fa fa-plus"></i></button>
</div>
<% } %>
<% } else { %>
<% if (editable) { %>
<div class="top buttons pull-right">
	<button type="button" id="add-new-header" class="add btn btn-sm" data-toggle="tooltip" data-content="Add new header" data-placement="left"><i class="fa fa-plus"></i></button>
</div>
<% } %>
<p>No headers.</p>
<% } %>