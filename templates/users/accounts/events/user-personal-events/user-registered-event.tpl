<td class="event">
	<label class="title"><i class="fa fa-user"></i>User Registered</label>

	<div class="description">You registered for the application.</div>
</td>

<td class="date">
	<%= typeof event_date !== 'undefined'? dateToSortableHTML(event_date) : '' %>
</td>