<td class="event">
	<label class="title"><i class="fa fa-folder-open"></i>Project <%- full_name %> Approved</label>

	<div class="description">Project <a href="<%- url %>" target="_blank"><%- full_name %></a> was approved by an administrator.</div>
</td>

<td class="date">
	<%= typeof event_date !== 'undefined'? dateToSortableHTML(event_date) : '' %>
</td>