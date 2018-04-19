<form class="form-horizontal">
		
	<h2>User Information</h2>
	<% for (var key in user_info) { %>
	<% if (user_info[key].type == 'text') { %>

	<div class="form-group" id="<%= key.replace(' ', '-') %>">
		<label class="<% if (user_info[key].required) { %>required <% } %>control-label"><%= key.toTitleCase() %></label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="<% if (user_info[key].required) { %>required <% } %>form-control" name="<%= key %>" maxlength="100" class="required"<% if (user_info[key].placeholder) { %> placeholder="<%= user_info[key].placeholder %>"<% } %> >
				<% if (user_info[key].help) { %>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="<%= key.toTitleCase() %>" data-content="<%= user_info[key].help %>"></i>
				</div>
				<% } %>
			</div>
		</div>
	</div>

	<% } else if (user_info[key].type == 'enum') { %>

	<div class="form-group" id="<%= key.replace(' ', '-') %>">
		<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="<%= key.toTitleCase() %>" data-content="<%= user_info[key].help %>"></i>
		<label class="control-label"><%= key.toTitleCase() %></label>
		<div class="controls">
		<% var name = key.replace(' ', '-'); %>
		<% for (var i = 0; i < user_info[key].values.length; i++) { %>
			<% var id = user_info[key].values[i].toLowerCase().replace(' ', '-'); %>
			<% var value = user_info[key].values[i].toLowerCase().replace(' ', '_'); %>
			<div class="radio">
				<label>
					<input type="radio" name="<%= name %>" id="<%= id %>" value="<%= value %>"<% if (i == 0) { %> checked<% } %>>
					<%= user_info[key].values[i].toTitleCase() %>
				</label>
			</div>
		<% } %>

		</div>
	</div>

	<% } %>
	<% } %>

	<% if (user_info_policy_text) { %>
	<h2>Policy</h2>
	<p><%= user_info_policy_text %></p>
	<br />
	<% } %>

	<div class="checkbox well">
		<label class="required">
			<input type="checkbox" no-focus name="confirm" class="required">
			I accept
		</label>
	</div>

	<br />
	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
