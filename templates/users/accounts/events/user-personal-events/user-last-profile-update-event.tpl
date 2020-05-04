<td class="event">
	<label class="title"><i class="fa fa-user"></i><i class="fa fa-pencil"></i>User Last Updated Profile</label>

	<div class="description">You previously updated your profile.</div>
</td>

<td class="date">
	<%= typeof event_date != 'undefined'? dateToSortableHTML(event_date) : '' %>
</td>