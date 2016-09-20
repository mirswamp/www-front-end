<td class="type first">
	<select>
		<option value="daily" <% if (recurrence_type == "daily") { %>selected<% } %>>Daily</option>
		<option value="weekly" <% if (recurrence_type == "weekly") { %>selected<% } %>>Weekly</option>
		<option value="monthly" <% if (recurrence_type == "monthly") { %>selected<% } %>>Monthly</option>
	</select>
</td>

<td class="day">
	<% if (recurrence_type == "weekly") { %>
	<select class="day-of-the-week">
		<option value="sunday" <% if (recurrence_day == 1) { %>selected<% } %>>Sunday</option>
		<option value="monday" <% if (recurrence_day == 2) { %>selected<% } %>>Monday</option>
		<option value="tuesday" <% if (recurrence_day == 3) { %>selected<% } %>>Tuesday</option>
		<option value="wednesday" <% if (recurrence_day == 4) { %>selected<% } %>>Wednesday</option>
		<option value="thursday" <% if (recurrence_day == 5) { %>selected<% } %>>Thursday</option>
		<option value="friday" <% if (recurrence_day == 6) { %>selected<% } %>>Friday</option>
		<option value="saturday" <% if (recurrence_day == 7) { %>selected<% } %>>Saturday</option>
	</select>
	<% } else if (recurrence_type == "monthly") { %>
		<input type="number" class="day-of-the-month form-control" value="<%- recurrence_day %>" min="0" max="31" placeholder="Day of the month" />
	<% } %>
</td>

<td class="time last">
	<% if (recurrence_type != "once") { %>
	<div class="bootstrap-timepicker form-group time_shim_container">
		<div class="input-group">
			<input type="text" class="input-small time_shim form-control" name="time-shim_<%- model.cid %>" value="<%- time_of_day_meridian %>" placeholder="Time" />
			<div class="input-group-addon">
				<i class="fa fa-clock-o"></i>
			</div>
		</div>
	</div>
	<div class="time_container form-group">
		<div class="input-group">
			<input type="time" class="time_input form-control" name="time_<%- model.cid %>" value="<%- time_of_day %>" placeholder="Time" />
			<div class="input-group-addon">
				<i class="fa fa-clock-o"></i>
			</div>
		</div>
	</div>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
