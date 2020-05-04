<div id="user-profile">

	<fieldset>
		<legend>Personal info</legend>
		<div class="form-group">
			<label class="form-label">First name</label>
			<span><%- first_name %></span>
		</div>
		<div class="form-group">
			<label class="form-label">Last name</label>
			<span><%- last_name %></span>
		</div>
	</fieldset>
	<fieldset>
		<legend>Contact info</legend>	
		<div class="form-group">
			<label class="form-label">Email address</label>
			<span><a href="mailto:<%- email %>"><%- email %></a></span>
		</div>
		<div class="form-group">
			<label class="form-label">Affiliation</label>
			<span><%- affiliation %></span>
		</div>
		<div class="form-group">
			<label class="form-label">Country</label>
			<span><%- country %></span>
		</div>
	</fieldset>
	<fieldset>
		<legend>Phone</legend>
		<div class="form-group">
			<label class="form-label">Country code</label>
			<span>
				<% if (phone.has('country-code')) { %>
					<%- phone.get('country-code') %>
				<% } %>
			</span>
		</div>
		<div class="form-group">
			<label class="form-label">Area code</label>
			<span>
				<% if (phone.has('area-code')) { %>
					(<%- phone.get('area-code') %>)
				<% } %>
			</span>
		</div>
		<div class="form-group">
			<label class="form-label">Phone number</label>
			<span>
				<% if (phone.has('phone-number')) { %>
					<%- phone.get('phone-number') %>
				<% } %>
			</span>
		</div>
	</fieldset>

	<div class="form-group">
		<label class="form-label">Question</label>
		<span><%- question %></span>
	</div>

 	<% if (false) { %>
	<fieldset>
		<legend>Dates</legend>
		<div class="form-group">
			<label class="form-label">Creation date</label>
			<span id="owner">
				<%= datetimeToHTML(create_date) %>
			</span>
		</div>
		<div class="form-group">
			<label class="form-label">Last modified</label>
			<span id="owner">
				<%= datetimeToHTML(update_date) %>
			</span>
		</label>
	</fieldset>
	<% } %>
</div>